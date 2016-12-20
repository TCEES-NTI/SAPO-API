'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let ItemSchema = new Schema({
  subnivelId: {
    type: Schema.ObjectId,
    ref: 'Subnivel'
  },
  nome: {
    type: String,
    required: true
  },
  exigencia: {
    type: String,
    required: true
  },
  notaMaxima: {
    type: Number
  },
  obrigatorio: {
    type: Number
  },
  bkpData: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Item', ItemSchema)
