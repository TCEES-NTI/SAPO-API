'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const populateDB = require('./app/utils/populate-db')
global.appState = {}

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', require('./app/routes/default'))

populateDB()

module.exports = app
console.log('API Started')
