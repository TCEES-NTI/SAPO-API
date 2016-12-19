'use strict'

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const dbConfig = require('../../keys')
var options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
}

const connect = (cb) => {
  const connectionString = dbConfig.DBURL === 'localhost' ? 
    'mongodb://' + dbConfig.DBURL + '/' + dbConfig.DBNAME :
    'mongodb://' + dbConfig.DBUSER + ':' + dbConfig.DBPASSWORD + '@' + dbConfig.DBURL + '/' + dbConfig.DBNAME
  mongoose.connect(connectionString, options, cb)
}

const disconnect = (cb) => {
  mongoose.disconnect(cb)
}

module.exports = {
  connect: connect,
  disconnect: disconnect
}
