const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config')
const db = {}

db.connection = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    config
)

db.User = require("../models/User")(db.connection, DataTypes)
db.Sueruser = require("../models/Superuser")(db.connection, DataTypes)
db.Client = require("../models/Client")(db.connection, DataTypes)
db.Apiauthentication = require("../models/Apiauthentication")(db.connection, DataTypes)



module.exports = db
