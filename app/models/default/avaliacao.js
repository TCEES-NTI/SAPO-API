'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Indicador = require('./indicador.js')

let AvaliacaoSchema = new Schema({
  indicador: {
    type: Schema.ObjectId,
    ref: 'Indicador'
  },
  indicadorHistorico: {
    type: Number
  },
  nome: {
    type: String
  },
  objetivos: {
    type: String
  },
  dataInicio: {
    type: Date, 
    default: Date.now
  },
  datafim: {
    type: Date
  },
  idHistorico: {
    type: Number
  }
})

AvaliacaoSchema.pre('validate', function (next) {
  return Indicador.findOne({idHistorico: this.indicadorHistorico})
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


module.exports = mongoose.model('Avaliacao', AvaliacaoSchema)
