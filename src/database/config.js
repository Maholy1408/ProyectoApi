require('dotenv').config()

const { Pool } = require('pg');

const connectionData = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  database: process.env.PGDBNAME,
  port: process.env.PGPORT
}

const pgPool = new Pool(connectionData)

module.exports = { pgPool }
