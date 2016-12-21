'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')
const Pontuacao = require('./pontuacao.js')
const Item = require('./item.js')
const ObjetoAvaliacao = require('./objeto-avaliacao.js')

let NotaSchema = new Schema({
  usuario: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  pontuacao: {
    type: Schema.ObjectId,
    ref: 'Pontuacao'
  },
  pontuacaoHistorico: {
    type: Number
  },
  item: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  itemHistorico: {
    type: Number
  },
  objetoAvaliacao: {
    type: Schema.ObjectId,
    ref: 'ObjetoAvaliacao'
  },
  objetoAvaliacaoHistorico: {
    type: Number
  },
  evidencias: {
    type: String
  },
  observacoes: {
    type: String
  },
  dataAvaliacao: {
    type: Date, 
    default: Date.now
  },
  idHistorico: {
    type: Number
  }
})

NotaSchema.pre('validate', function (next) {
  if (this.pontuacaoHistorico && this.itemHistorico && this.objetoAvaliacaoHistorico) {
    console.log('Validando Nota')
    return Pontuacao.findOne({ idHistorico: this.pontuacaoHistorico })
      .then((res) => {
        console.log('Pontuacao', !!res)
        if (!res) {
          return new Error('Pontuacao nao encontrada')
        }
        this.pontuacao = res._id
        this.pontuacaoHistorico = undefined
        return Item.findOne({ idHistorico: this.itemHistorico })
      })
      .this((res) => {
        console.log('Item', !!res)
        if (!res) {
          return new Error('Item nao encontrado')
        }
        this.item = res._id
        this.itemHistorico = undefined
        return ObjetoAvaliacao.findOne({ idHistorico: this.objetoAvaliacaoHistorico })
      })
      .then((res) => {
        if (!res) {
          return new Error('ObjetoAvaliacao nao encontrado')
        }
        console.log('ObjetoAvaliacao', !!res)
        this.objetoAvaliacao = res._id
        this.objetoAvaliacaoHistorico = undefined
        return next()
      })
      .catch((err) => {
        this.pontuacaoHistorico = undefined
        this.itemHistorico = undefined
        this.objetoAvaliacaoHistorico = undefined
        return next()
      })
  }
  return next()
})

module.exports = mongoose.model('Nota', NotaSchema)
