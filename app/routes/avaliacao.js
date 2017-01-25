'use strict'

const Avaliacao = require('../models/default/avaliacao')
const ObjetoAvaliacao = require('../models/default/objeto-avaliacao')
const Nota = require('../models/default/nota')
const Pontuacao = require('../models/default/pontuacao')
let modelAttributes = Object.keys(Avaliacao.schema.paths).filter(key => key !== '__v' && key !== '_id')
const config = require('../../keys')
const URL = '/create'
const _ = require('lodash')

module.exports = (router, JWTAuth) => {
  router.route(URL + '/avaliacao')
    .post(JWTAuth, (req, res, next) => {
      let avaliacao = new Avaliacao()
      modelAttributes.forEach((key) => {
        _.set(avaliacao, key, req.body[key] ? req.body[key] : avaliacao[key])
      })
      return avaliacao.save()
        .then(response => {
          return Promise.all(req.body.entidades.split(',').map((entidadeId) => {
            let objetoAvaliacao = new ObjetoAvaliacao()
            objetoAvaliacao.entidade = entidadeId
            objetoAvaliacao.avaliacao = response._id
            objetoAvaliacao.observacoes = req.body.observacoes || undefined
            return objetoAvaliacao.save()
          }))
        })
        .then(response => {
          return Promise.all(req.body.itens.split(',').reduce((result, item) => {
            return result.concat(Promise.all(response.map(objetoAvaliacao => {
              let nota = new Nota()
              nota.item = item
              nota.objetoAvaliacao = objetoAvaliacao
              nota.observacoes = req.body.observacoes
              return nota.save()
            })))
          }, []))
        })
        .then(response => {
          res.json({ message: 'Avaliacao was created successfully' })
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 403).send(error.message)
          next()
        })
    })
  return router
}
