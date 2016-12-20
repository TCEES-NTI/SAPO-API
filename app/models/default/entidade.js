'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let EntidadeSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  poder: {
    type: String,
    required: true
  },
  esfera: {
    type: String,
    required: true
  },
  geonames: {
    type: String
  },
  dbpedia: {
    type: String
  },
  populacao: {
    type: String
  },
  pib: {
    type: String
  },
  bkpData: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Entidade', EntidadeSchema)
