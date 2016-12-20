'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Norma = require('./norma.js')
console.log(Norma)

let CriterioLegalSchema = new Schema({
  norma: {
    type: Schema.ObjectId,
    ref: 'Norma'
  },
  normaHistorico: {
    type: Number
  },
  descricao: {
    type: String,
    required: true
  },
  idHistorico: {
    type: Number
  }
})

CriterioLegalSchema.pre('validate', function (next) {
  console.log(this)
  Norma.find({ idHistorico: 1})
    .then((res) => {
      console.log('Aqui?', res)
      // this.norma = res._id
      this.normaHistorico = undefined
      return next()
    })
    .catch((err) => {
      console.log('Tenho erros?', err)
      this.normaHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('CriterioLegal', CriterioLegalSchema)
