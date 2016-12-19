'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let criterioLegalSchema = new Schema({
  NormaId: {
    type: Schema.ObjectId,
    ref: 'Indicador'
  },
  descricao: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('CriterioLegal', criterioLegalSchema)
