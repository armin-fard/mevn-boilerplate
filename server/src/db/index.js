const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

client.connect(err => {
  if (err) {
    throw new Error(err)
  }
})

module.exports = {
  query: (text, params) => client.query(text, params)
}