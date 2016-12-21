'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Norma = require('./norma.js')

let CriterioLegalSchema = new Schema({
  norma: {
    type: Schema.ObjectId,
    ref: 'Norma'
  },
  normaHistorico: {
    type: Number
  },
  descricao: {
    type: String
  },
  idHistorico: {
    type: Number
  }
})

CriterioLegalSchema.pre('validate', function (next) {
  Norma.findOne({ idHistorico: this.normaHistorico })
    .then((res) => {
      this.norma = res._id
      this.normaHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.normaHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('CriterioLegal', CriterioLegalSchema)
