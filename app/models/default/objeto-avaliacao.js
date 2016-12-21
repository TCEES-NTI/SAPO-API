'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Entidade = require('./entidade.js')
const Avaliacao = require('./avaliacao.js')

let ObjetoAvaliacaoSchema = new Schema({
  entidade: {
    type: Schema.ObjectId,
    ref: 'Entidade'
  },
  entidadeHistorico: {
    type: Number
  },
  avaliacao: {
    type: Schema.ObjectId,
    ref: 'Avaliacao'
  },
  avaliacaoHistorico: {
    type: Number
  },
  observacoes: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

ObjetoAvaliacaoSchema.pre('validate', function (next) {
  Entidade.findOne({ idHistorico: this.entidadeHistorico })
    .then((res) => {
      this.entidade = res._id
      this.entidadeHistorico = undefined
      return Avaliacao.findOne({ idHistorico: this.avaliacaoHistorico })
    })
    .then((res) => {
      this.avaliacao = res._id
      this.avaliacaoHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.avaliacaoHistorico = undefined
      this.entidadeHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('ObjetoAvaliacao', ObjetoAvaliacaoSchema)
