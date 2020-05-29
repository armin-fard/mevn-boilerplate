const invoices = require('./invoices')

module.exports = app => {
  app.use('/invoices', invoices)
}