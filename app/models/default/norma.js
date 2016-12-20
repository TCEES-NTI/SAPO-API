'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let NormaSchema = new Schema({
  tipo: {
    type: String,
    required: true
  },
  nome: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

module.exports = mongoose.model('Norma', NormaSchema)
