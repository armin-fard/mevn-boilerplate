const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const mountRoutes = require('./routes')

let port = null
let whitelistURL = ''

if (process.env.NODE_ENV === 'development') {
  port = process.env.PORT
  whitelistURL = process.env.LOCAL_HOST_ORIGIN
}

app.use(morgan('combined'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', [whitelistURL]);
  res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

mountRoutes(app)


// middleware used to handle any unspecified routes
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// middleware used to handle any errors that have not been handled yet
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})
app.listen(port)