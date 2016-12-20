'use strict'

const Models = require('require-dir')('../models/default')
const mongoose = require('./connection')
const csvRequire = require('better-require')('csv')
const _ = require('lodash')

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

const creationFunctions = {
  'avaliacao':  null,
  'criterio-legal': null,
  'entidade': createEntidades,
  'indicador': createIndicadores,
  'item': null,
  'maturidade': createMaturidades,
  'nivel-maturidade': null,
  'nivel': null,
  'norma': createNormas,
  'nota': null,
  'objeto-avaliacao': null,
  'pilar': null,
  'pontuacao': null,
  'subnivel': null,
  'tipo': null
}

function createIndicadores (indicadoresData, Model) {
  return indicadoresData.map((indicadorData) => {
    var indicador = new Model()
    indicador.nome = indicadorData[1]
    indicador.objetivos = indicadorData[2]
    indicador.bkpData = true
    return indicador.save()
  })
}

function createEntidades (entidadesData, Model) {
  return entidadesData.map((entidadeData) => {
    var entidade = new Model()
    entidade.nome = entidadeData[1]
    entidade.poder =  entidadeData[2]
    entidade.esfera = entidadeData[3]
    entidade.geonames = entidadeData[4]
    entidade.dbpedia = entidadeData[5]
    entidade.populacao = entidadeData[6]
    entidade.pib = entidadeData[7]
    entidade.bkpData = true
    return entidade.save()
  })
}

function createMaturidades (maturidadesData, Model) {
  return maturidadesData.map((maturidadeData) => {
    var maturidade = new Model()
    maturidade.nome = maturidadeData[1]
    maturidade.bkpData = true
    return maturidade.save()
  })
}

function createNormas (normasData, Model) {
  return normasData.map((normaData) => {
    var norma = new Model()
    norma.tipo = normaData[1]
    norma.nome =  normaData[2]
    norma.bkpData = true
    return norma.save()
  })
}

function populateModel (modelname) {
  let Model = Models[modelname]
  return Model.remove({ bkpData: true })
    .then((res) => Promise.all(creationFunctions[modelname](Data[modelname], Model)))
    .catch((err) => {
      console.log(err)
    })
}

module.exports = function () {
  mongoose.connect()
  console.log('Populating database with previous data')
  const modelNames = ['indicador', 'entidade', 'maturidade', 'norma']
  Promise.all( modelNames.map(modelName => populateModel(modelName)) )
    .then((res) => {
      console.log('Database filled')
      mongoose.disconnect()    
    })
    .catch(console.log)
}