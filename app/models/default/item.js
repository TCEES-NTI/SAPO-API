'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Subnivel = require('./subnivel.js')

let ItemSchema = new Schema({
  subnivel: {
    type: Schema.ObjectId,
    ref: 'Subnivel'
  },
  subnivelHistorico: {
    type: Number
  },
  nome: {
    type: String
  },
  exigencia: {
    type: String
  },
  notaMaxima: {
    type: Number
  },
  obrigatorio: {
    type: Number
  },
  idHistorico: {
    type: Number
  }
})

ItemSchema.pre('validate', function (next) {
  Subnivel.findOne({ idHistorico: this.subnivelHistorico })
    .then((res) => {
      this.subnivel = res._id
      this.subnivelHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.subnivelHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Item', ItemSchema)
