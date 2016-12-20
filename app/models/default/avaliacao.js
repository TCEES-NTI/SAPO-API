'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let AvaliacaoSchema = new Schema({
  indicadorId: {
    type: Schema.ObjectId,
    ref: 'Indicador'
  },
  nome: {
    type: String,
    required: true
  },
  objetivos: {
    type: String,
    required: true
  },
  dataInicio: {
    type: Date, 
    default: Date.now
  },
  datafim: {
    type: Date
  },
  bkpData: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema)
