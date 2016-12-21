'use strict'

const Models = require('require-dir')('../models/default')
const mongoose = require('./connection')
const csvRequire = require('better-require')('csv')

const Data = {
  'avaliacao':  require('../../data/avaliacao.csv'),
  'criterio-legal': require('../../data/criterio-legal.csv'),
  'entidade': require('../../data/entidade.csv'),
  'indicador': require('../../data/indicador.csv'),
  'item': require('../../data/item.csv'),
  'maturidade': require('../../data/maturidade.csv'),
  'nivel-maturidade': require('../../data/nivel-maturidade.csv'),
  'nivel': require('../../data/nivel.csv'),
  'norma': require('../../data/norma.csv'),
  'nota': require('../../data/nota.csv'),
  'objeto-avaliacao': require('../../data/objeto-avaliacao.csv'),
  'pilar': require('../../data/pilar.csv'),
  'pontuacao': require('../../data/pontuacao.csv'),
  'subnivel': require('../../data/subnivel.csv'),
  'tipo': require('../../data/tipo.csv')
}

const creationAttributes = {
  'avaliacao': {
    nome: 2,
    objetivos: 3,
    indicadorHistorico: 1,
    idHistorico: 0
  },
  'criterio-legal': {
    descricao: 2,
    normaHistorico: 1,
    idHistorico: 0
  },
  'entidade': {
    nome: 1,
    poder: 2,
    esfera: 3,
    geonames: 4,
    dbpedia: 5,
    populacao: 6,
    pib: 7,
    idHistorico: 0
  },
  'indicador': {
    nome: 1,
    objetivos: 2,
    idHistorico: 0
  },
  'item': null,
  'maturidade': {
    nome: 1,
    idHistorico:0
  },
  'nivel-maturidade': null,
  'nivel': null,
  'norma': {
    tipo: 1,
    nome: 2,
    idHistorico: 0
  },
  'nota': null,
  'objeto-avaliacao': null,
  'pilar': {
    nome: 2,
    descricao: 3,
    indicadorHistorico: 1,
    idHistorico: 0
  },
  'pontuacao': null,
  'subnivel': null,
  'tipo': {
    nome: 1,
    descricao: 3,
    pilarHistorico: 2,
    idHistorico: 0
  }
}

function createModel (options, multipleData, Model) {
  return multipleData.map((singleData) => {
    return newModelAttributes(options, singleData, Model)
  })
}

function newModelAttributes (attributesObj, data, Model) {
  var model = new Model()
  return Object.keys(attributesObj).reduce((model, attrKey) => {
    model[attrKey] = data[attributesObj[attrKey]] && data[attributesObj[attrKey]] !== "NULL" ? data[attributesObj[attrKey]] : undefined
    return model
  }, model).save()
}

function populateModel (modelname) {
  let Model = Models[modelname]
  return Model.remove({ idHistorico: { $exists: true }})
    .then((res) => Promise.all(createModel(creationAttributes[modelname], Data[modelname], Model)))
    .catch((err) => {
      console.log(err)
    })
}

module.exports = function () {
  mongoose.connect()
  console.log('Populating database with previous data')
  // Models without reference
  let modelNames = ['norma', 'indicador', 'entidade', 'maturidade']
  Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    .then((res) => {
      // Models with references
      modelNames = ['avaliacao', 'criterio-legal', 'pilar', 'tipo']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      mongoose.disconnect()
    })
    .catch(console.log)
}