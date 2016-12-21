'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Indicador = require('./indicador.js')

let PilarSchema = new Schema({
  indicador: {
    type: Schema.ObjectId,
    ref: 'Entidade'
  },
  indicadorHistorico: {
    type: Number
  },
  nome: {
    type: String
  },
  descricao: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

PilarSchema.pre('validate', function (next) {
  Indicador.findOne({ idHistorico: this.indicadorHistorico })
    .then((res) => {
      this.indicador = res._id
      this.indicadorHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.indicadorHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Pilar', PilarSchema)
