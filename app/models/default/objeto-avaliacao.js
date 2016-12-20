'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let ObjetoAvaliacaoSchema = new Schema({
  entidadeId: {
    type: Schema.ObjectId,
    ref: 'Entidade'
  },
  avaliacaoId: {
    type: Schema.ObjectId,
    ref: 'Avaliacao'
  },
  observacoes: {
    type: String
  },
  bkpData: {
    type: Number
  }
})

module.exports = mongoose.model('ObjetoAvaliacao', ObjetoAvaliacaoSchema)
