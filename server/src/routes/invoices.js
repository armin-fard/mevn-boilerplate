const Router = require('express-promise-router')
const multer = require('multer')
const InvoicesController = require('../controllers/invoices')

const router = new Router()
module.exports = router

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})

router.post('/:userId/update', upload.any(),
  (req, res, next) => {
    InvoicesController.updateInvoices(req, res, next)
})