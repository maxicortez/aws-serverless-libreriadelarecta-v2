const mysql = require('mysql2/promise')
const dbConnectionString = require('../config')

const mysqlConnection = mysql.createPool({
    host: dbConnectionString.host,
    port: dbConnectionString.port,
    database: dbConnectionString.database,
    user: dbConnectionString.username,
    password: dbConnectionString.password
})

module.exports = {
    mysqlConnection,
}  