'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Maturidade = require('./maturidade.js')

let NivelMaturidadeSchema = new Schema({
  maturidade: {
    type: Schema.ObjectId,
    ref: 'Maturidade'
  },
  maturidadeHistorico: {
    type: Number
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

NivelMaturidadeSchema.pre('validate', function (next) {
  Maturidade.findOne({ idHistorico: this.maturidadeHistorico })
    .then((res) => {
      this.maturidade = res._id
      this.maturidadeHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.maturidadeHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('NivelMaturidade', NivelMaturidadeSchema)
