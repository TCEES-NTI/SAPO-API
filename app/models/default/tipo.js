'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Pilar = require('./pilar.js')

let TipoSchema = new Schema({
  pilar: {
    type: Schema.ObjectId,
    ref: 'Pilar'
  },
  pilarHistorico: {
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

TipoSchema.pre('validate', function (next) {
  Pilar.findOne({ idHistorico: this.pilarHistorico })
    .then((res) => {
      this.pilar = res._id
      this.pilarHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.pilarHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Tipo', TipoSchema)
