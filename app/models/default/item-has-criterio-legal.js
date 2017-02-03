'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Item = require('./item.js')
const CriterioLegal = require('./criterio-legal.js')

let ItemHasCriterioLegalSchema = new Schema({
  item: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  itemHistorico: {
    type: Number
  },
  criterioLegal: {
    type: Schema.ObjectId,
    ref: 'CriterioLegal'
  },
  criterioLegalHistorico: {
    type: Number
  },
  idHistorico: {
    type: Number
  }
})

ItemHasCriterioLegalSchema.pre('validate', function (next) {
  Item.findOne({ idHistorico: this.itemHistorico })
    .then((res) => {
      this.item = res._id
      this.itemHistorico = undefined
      return CriterioLegal.findOne({ idHistorico: this.criterioLegalHistorico })
    })
    .then((res) => {
      this.criterioLegal = res._id
      this.criterioLegalHistorico = undefined
      return next()
    })
    .catch((err) => {
      this.itemHistorico = undefined
      this.criterioLegalHistorico = undefined
      return next()
    })
})

module.exports = mongoose.model('ItemHasCriterioLegal', ItemHasCriterioLegalSchema)
