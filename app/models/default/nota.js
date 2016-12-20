'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let NotaSchema = new Schema({
  usuarioId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  pontuacaoId: {
    type: Schema.ObjectId,
    ref: 'Pontuacao'
  },
  itemId: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  objetoAvaliacaoId: {
    type: Schema.ObjectId,
    ref: 'ObjetoAvaliacao'
  },
  evidencias: {
    type: String
  },
  observacoes: {
    type: String
  },
  dataAvaliacao: {
    type: Date, 
    default: Date.now
  },
  idHistorico: {
    type: Number
  }
})

module.exports = mongoose.model('Nota', NotaSchema)
