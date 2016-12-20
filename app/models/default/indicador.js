'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let IndicadorSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  objetivos: {
    type: String
  },
  bkpData: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Indicador', IndicadorSchema)
