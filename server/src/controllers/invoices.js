const db = require('../db')
//  uuid version 4
const { v4 } = require('uuid')
const moment = require('moment')
const csv = require('csvtojson')
require('dotenv').config()

module.exports = {
  // updates current invoices or creates new invoice resources in db
  async updateInvoices(req, res, next) {
    const userId = req.params.userId
    let compiled = []
    const newInvoiceNumbers = []
    try {
      let file = req.files[0]
      let filename = file.originalname
      let content = Buffer.from(file.buffer).toString('ascii')
      const csvRows = await csv({
        output: 'csv'
      }).fromString(content)
      for (let csvRow of csvRows) {
        // The wrapping if-statement ignores the empty rows and the headers in the .csv file.
        if (csvRow[0] !== '' && csvRow[0] !== 'invoice_number') {

          const invoice = [ invoice_number, client_name, date, due_date, billing_period_from, billing_period_to,
            remittance_address, account_number, ach_info, description, quantity, rate, sales_tax,
            total_amount, open_balance ] = csvRow

          // Appending the invoice number to the newIvoiceNumbers array to check against later.
          newInvoiceNumbers.push(parseInt(invoice_number))

          const selectValue = [invoice_number]
          const selectQuery = `
            SELECT * FROM invoices
            WHERE invoice_number = $1
          `
          const response = await db.query(selectQuery, selectValue)
          if (!response.rows.length) {
            // !TO DO: Query for the client resource based on client_name column to insert in client_invoice join table

            const invoice_id = v4()

            const insertValues = [userId, invoice_id, ...invoice]
            const insertQuery = `
              INSERT INTO invoices(user_id, invoice_id, invoice_number, client_name, date, due_date, 
                billing_period_from, billing_period_to, remittance_address, account_number, ach_info, 
                description, quantity, rate, sales_tax, total_amount, open_balance)
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
              RETURNING *
            `
            const { rows } = await db.query(insertQuery, insertValues)
            compiled = [...compiled, rows[0]]

          } else {
            const { rows } = response
            compiled = [...compiled, rows[0]]
          }
        }          
      }
      return res.status(201).json({
        message: 'Invoices updated successfully',
        data: compiled
      })
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  },
  async uploadInvoiceSupportingDocs(req, res, next) {
    try {
      // Uploads supporting document attachments for each invoice A/R report to designated S3 bucket.
      // These files are then retrieved from S3 and downloaded by the client AP PoC based on the A/R object's 'docs' [Array] prop.
      const invoiceId = req.params.invoiceId
      let invoiceFound = await Invoice.findById(invoiceId)
      let docKeys = []
      if (invoiceFound) {
        for (let file of req.files) {
          let fileObj = {}
          fileObj.filename = file.originalname
          fileObj.content = Buffer.from(file.buffer)
          let fileKey = process.env.INVOICE_DOCS + '/' + fileObj.filename
          if (!invoiceFound.docs.includes(fileKey)) {
            docKeys.push(fileKey)
          }
          // Parameters for bucket path, file name and file object.
          const uploadParams = {
            Bucket: s3Bucket,
            ACL: 'public-read',
            Key: fileKey,
            Body: fileObj.content
          }
          // Options determine file size and the number of concurrent uploads.
          // Currently set at 1 to make sure each iteration in the for-loop only uploads one file to the bucket.
          const uploadOptions = {
            // size = 10mb
            partSize: 10 * 1024 * 1024,
            queueSize: 1
          }
          // Upload function includes file parameters and the option parameters for configuration.
          s3.upload(uploadParams, uploadOptions, (err, data) => {
            if (err) {
              res.status(500).json({
                error: err
              })
            }
          })
        }
        invoiceFound.docs = [...invoiceFound.docs, ...docKeys]
        await invoiceFound.save()
        return res.status(201).json({
          message: 'File(s) uploaded successfully',
          docs: docKeys,
          invoice: invoiceFound
        })
      } else {
        // not found
        res.status(404).json({
          message: 'No invoice was found'
        })
      }
    } catch (err) {
      // server error
      res.status(500).json({
        error: err
      })
    }
  },
  async getAllInvoices(req, res, next) {
    // GET request to retrieve all client invoices for JLM admins.
    try {
      const invoicesFound = await Invoice.find()
      if (invoicesFound) {
        return res.status(200).json({
          message: 'Client invoices retrieved successfully.',
          data: invoicesFound
        })
      } else {
        return res.status(404).json({
          message: 'No invoices were found.'
        })
      }
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  },
  async getClientInvoices(req, res, next) {
    // GET request to retrieve all invoices based on a client's associated project names.
    const clientId = req.params.clientId
    try {
      const clientFound = await User.findById(clientId)
      if (clientFound) {
        let clientInvoices = []
        const projects = clientFound.role.project
        for (const project of projects) {
          const invoicesFound = await Invoice.find({ project: project, paid: false })
          clientInvoices = [...clientInvoices, ...invoicesFound]
        }
        return res.status(200).json({
          message: 'Invoices retrieved successfully.',
          data: clientInvoices
        })
      } else {
        return res.status(404).json({
          message: 'The client records were not found.'
        })
      }
      
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  }
}