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

app.use('/api', require('./app/routes/default'))

populateDB()

module.exports = app
console.log('API Started')
