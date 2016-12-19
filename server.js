'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
global.appState = {}

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', require('./app/routes/default'))

module.exports = app
console.log('API Started')
