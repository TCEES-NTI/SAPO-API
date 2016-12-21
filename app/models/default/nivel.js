'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Tipo = require('./tipo.js')

let NivelSchema = new Schema({
  tipo: {
    type: Schema.ObjectId,
    ref: 'Tipo'
  },
  tipoHistorico: {
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

NivelSchema.pre('validate', function (next) {
  Tipo.findOne({ idHistorico: this.tipoHistorico })
    .then((res) => {
      this.tipo = res._id
      this.tipoHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.tipoHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Nivel', NivelSchema)
