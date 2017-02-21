'use strict'

const Item = require('../models/default/item')
const SubNivel = require('../models/default/subnivel')
const Nivel = require('../models/default/nivel')
const Tipo = require('../models/default/tipo')
const Pilar = require('../models/default/pilar')
const Indicador = require('../models/default/indicador')
const CriterioLegal = require('../models/default/criterio-legal')
const Avaliacao = require('../models/default/avaliacao')
const ObjetoAvaliacao = require('../models/default/objeto-avaliacao')
const Nota = require('../models/default/nota')
const Pontuacao = require('../models/default/pontuacao')
let modelAttributes = Object.keys(Item.schema.paths).filter(key => key !== '__v' && key !== '_id')
const config = require('../../keys')
const cache = require('../utils/cache')
const CONSTS = require('../utils/constants')
const URL = '/populate'

module.exports = (router, JWTAuth) => {
  router.route(URL + '/item/:id')
    .get(JWTAuth, (req, res, next) => {
      return Item.findById(req.params.id)
        .populate({
          path: 'subnivel',
          model: 'Subnivel',
          populate: {
            path: 'nivel',
            model: 'Nivel',
            populate: {
              path: 'tipo',
              model: 'Tipo',
              populate: {
                path: 'pilar',
                model: 'Pilar',
                populate: {
                  path: 'indicador',
                  model: 'Indicador'
                }
              }
            }
          }
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/item')
    .get(JWTAuth, cache(6 * 60 * 60), (req, res, next) => {
      if (req.responseReady) {
        res.send(req.responseReady)
        next()
      } else {
        return Item.find()
        .populate({
          path: 'subnivel',
          model: 'Subnivel',
          populate: {
            path: 'nivel',
            model: 'Nivel',
            populate: {
              path: 'tipo',
              model: 'Tipo',
              populate: {
                path: 'pilar',
                model: 'Pilar',
                populate: {
                  path: 'indicador',
                  model: 'Indicador'
                }
              }
            }
          }
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
      }
      
    })
  router.route(URL + '/avaliacao')
    .get(JWTAuth, (req, res, next) => {
        let filter = {}
        if (req.decoded.role !== CONSTS.USER_ROLE.ADMIN) {
           filter = {'usuarios': req.decoded._id}
        }
        return Avaliacao.find(filter)
        .populate({
          path: 'indicador',
          model: 'Indicador'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
      
    })
  router.route(URL + '/avaliacao/:avaliacaoId/objetoAvaliacao')
    .get(JWTAuth, cache(60), (req, res, next) => {
      if (req.responseReady) {
        res.send(req.responseReady)
        next()
      } else {
        let objetosAvaliacao = []
          return ObjetoAvaliacao.find({ avaliacao: req.params.avaliacaoId })
          .populate({
            path: 'entidade',
            model: 'Entidade'
          })
          .then(response => {
            objetosAvaliacao = response
            return Promise.all(objetosAvaliacao.map((objetoAvaliacao) => {
              return Nota.find({ objetoAvaliacao: objetoAvaliacao._id })
                .populate({
                  path:'pontuacao',
                  model: 'Pontuacao'
                })
                .populate({
                  path:'item',
                  model: 'Item'
                })
            }))
          })
          .then(response => {
            let allNotas = response
            allNotas.forEach((notas) => {
              let completude = notas.reduce((result, nota) => {
                result.complete = nota.pontuacao ? result.complete + 1 : result.complete
                result.total = result.total + 1
                result.availableResult = result.availableResult + nota.item.notaMaxima
                if (nota.pontuacao && nota.item) {
                  result.result = result.result + (nota.pontuacao.nota * nota.item.notaMaxima)                
                }
                return result
              }, {complete: 0, total: 0, result: 0, availableResult: 0})
              completude.objetoAvaliacao = notas[0].objetoAvaliacao
              objetosAvaliacao = objetosAvaliacao.map(objetoAvaliacao => {
                if (objetoAvaliacao._id.toString() === completude.objetoAvaliacao.toString()) {
                  objetoAvaliacao = objetoAvaliacao.toObject()
                  objetoAvaliacao.completude = parseFloat((completude.complete / completude.total) * 100).toFixed(2)
                  objetoAvaliacao.resultado = completude.result
                  objetoAvaliacao.notaMaxima = completude.availableResult
                }
                return objetoAvaliacao
              })  
            })
            return objetosAvaliacao
          })
          .then(response => {
            res.json(response)
            next()
          })
          .catch(error => {
            res.status(error.statusCode || 500).send(error.message)
            next()
          })
      }
    })
  router.route(URL + '/objetoAvaliacao/:objetoAvaliacaoId/nota')
    .get(JWTAuth, (req, res, next) => {
        let notas = []
        return Nota.find({ objetoAvaliacao: req.params.objetoAvaliacaoId })
        .populate({
          path: 'item',
          model: 'Item',
          populate: {
            path: 'subnivel',
            model: 'Subnivel',
            populate: {
              path: 'nivel',
              model: 'Nivel',
              populate: {
                path: 'tipo',
                model: 'Tipo',
              }
            }
          }
        })
        .then(response => {
          notas = response
          return Promise.all(notas.map(nota => Pontuacao.find({ item: nota.item })))
        })
        .then(response => {
          return response.reduce((notas, pontuacoes) => {
            return notas.map((nota) => {
              if (pontuacoes[0].item.toString() == nota.item._id) {
                nota = nota.toObject()
                pontuacoes.sort((a, b) => a.nota - b.nota)
                nota.item.pontuacoes = pontuacoes
              }
              return nota
            })
          }, notas)
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          console.log('Aqui?', error.message)
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
      
    })

  router.route(URL + '/parent/criterioLegal')
    .get(JWTAuth, (req, res, next) => {
        return CriterioLegal.find()
        .populate({
          path: 'norma',
          model: 'Norma'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/item')
    .get(JWTAuth, (req, res, next) => {
        return Item.find()
        .populate({
          path: 'subnivel',
          model: 'Subnivel'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/subnivel')
    .get(JWTAuth, (req, res, next) => {
        return SubNivel.find()
        .populate({
          path: 'nivel',
          model: 'Nivel'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/nivel')
    .get(JWTAuth, (req, res, next) => {
        return Nivel.find()
        .populate({
          path: 'tipo',
          model: 'Tipo'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/tipo')
    .get(JWTAuth, (req, res, next) => {
        return Tipo.find()
        .populate({
          path: 'pilar',
          model: 'Pilar'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/pilar')
    .get(JWTAuth, (req, res, next) => {
        return Pilar.find()
        .populate({
          path: 'indicador',
          model: 'Indicador'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
  router.route(URL + '/parent/pontuacao')
    .get(JWTAuth, (req, res, next) => {
        return Pontuacao.find()
        .populate({
          path: 'item',
          model: 'Item'
        })
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
    
    
  return router
}
