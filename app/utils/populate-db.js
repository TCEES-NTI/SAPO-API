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
  'item-has-criterio-legal': require('../../data/item_has_criteriolegal.csv'),
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
  'item': {
    subnivelHistorico: 1,
    nome: 2,
    exigencia: 3,
    notaMaxima: 4,
    obrigatorio: 5,
    idHistorico: 0
  },
  'item-has-criterio-legal': {
    itemHistorico: 0,
    criterioLegalHistorico: 1,
    idHistorico: 0
  },
  'maturidade': {
    nome: 1,
    idHistorico:0
  },
  'nivel-maturidade': {
    posicao: 2,
    nome: 3,
    maturidadeHistorico: 1,
    idHistorico: 0
  },
  'nivel': {
    nome: 2,
    descricao: 3,
    tipoHistorico: 1,
    idHistorico: 0
  },
  'norma': {
    tipo: 1,
    nome: 2,
    idHistorico: 0
  },
  'nota': {
    pontuacaoHistorico: 2,
    itemHistorico: 3,
    objetoAvaliacaoHistorico: 4,
    evidencias: 6,
    observacoes: 7,
    dataAvaliacao: 5,
    idHistorico: 0
  },
  'objeto-avaliacao': {
    observacoes: 3,
    idHistorico: 0,
    entidadeHistorico: 1,
    avaliacaoHistorico: 2
  },
  'pilar': {
    nome: 2,
    descricao: 3,
    indicadorHistorico: 1,
    idHistorico: 0
  },
  'pontuacao': {
    itemHistorico: 1,
    idHistorico: 0,
    descricao: 2,
    nota: 3
  },
  'subnivel': {
    nome: 2,
    descricao: 3,
    nivelHistorico: 1,
    idHistorico: 0
  },
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
  let modelNames = ['norma', 'indicador', 'entidade', 'maturidade']
  Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    .then((res) => {
      modelNames = ['avaliacao', 'criterio-legal', 'pilar', 'nivel-maturidade']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      modelNames = ['tipo', 'objeto-avaliacao']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      modelNames = ['nivel']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      modelNames = ['subnivel']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      modelNames = ['item']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      modelNames = ['pontuacao']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    // .then((res) => {
    //   modelNames = ['nota']
    //   return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    // })
    .then((res) => {
      modelNames = ['item-has-criterio-legal']
      return Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    })
    .then((res) => {
      console.log('Done populating database')
      mongoose.disconnect()
    })
    .catch(console.log)
}