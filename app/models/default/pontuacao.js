'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let PontuacaoSchema = new Schema({
  itemId: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  descricao: {
    type: String
  },
  nota: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Pontuacao', PontuacaoSchema)
