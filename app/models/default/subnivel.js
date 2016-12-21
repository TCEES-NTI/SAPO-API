'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Nivel = require('./nivel.js')

let SubnivelSchema = new Schema({
  nivel: {
    type: Schema.ObjectId,
    ref: 'Nivel'
  },
  nivelHistorico: {
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

SubnivelSchema.pre('validate', function (next) {
  Nivel.findOne({ idHistorico: this.nivelHistorico })
    .then((res) => {
      this.nivel = res._id
      this.nivelHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.nivelHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Subnivel', SubnivelSchema)
