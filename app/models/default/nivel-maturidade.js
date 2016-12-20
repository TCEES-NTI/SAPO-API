'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let nivelMaturidadeSchema = new Schema({
  maturidadeId: {
    type: Schema.ObjectId,
    ref: 'Maturidade'
  },
  posicao: {
    type: Number
  },
  nome: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

module.exports = mongoose.model('NivelMaturidade', nivelMaturidadeSchema)
