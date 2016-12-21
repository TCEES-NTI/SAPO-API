'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Item = require('./item.js')

let PontuacaoSchema = new Schema({
  item: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  itemHistorico: {
    type: Number
  },
  descricao: {
    type: String
  },
  nota: {
    type: Number,
    default: 0
  },
  idHistorico: {
    type: Number
  }
})

PontuacaoSchema.pre('validate', function (next) {
  Item.findOne({ idHistorico: this.itemHistorico })
    .then((res) => {
      this.item = res._id
      this.itemHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.itemHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('Pontuacao', PontuacaoSchema)
