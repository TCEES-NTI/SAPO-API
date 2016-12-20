'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let NivelSchema = new Schema({
  tipoId: {
    type: Schema.ObjectId,
    ref: 'Tipo'
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

module.exports = mongoose.model('Nivel', NivelSchema)
