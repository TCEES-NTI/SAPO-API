'use strict'

const Item = require('../models/default/item')
const SubNivel = require('../models/default/subnivel')
const Nivel = require('../models/default/nivel')
const Tipo = require('../models/default/tipo')
const Pilar = require('../models/default/pilar')
const CriterioLegal = require('../models/default/criterio-legal')
const ItemHasCriterioLegal = require('../models/default/item-has-criterio-legal')
const Avaliacao = require('../models/default/avaliacao')
const ObjetoAvaliacao = require('../models/default/objeto-avaliacao')
const Nota = require('../models/default/nota')
const Pontuacao = require('../models/default/pontuacao')
// let modelAttributes = Object.keys(Item.schema.paths).filter(key => key !== '__v' && key !== '_id')
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
          .populate({
            path: 'avaliacao',
            model: 'Avaliacao'
          })
          .then(response => {
            objetosAvaliacao = response
            return Promise.all(objetosAvaliacao.map((objetoAvaliacao) => {
              return Nota.find({ objetoAvaliacao: objetoAvaliacao._id })
                .populate({
                  path: 'pontuacao',
                  model: 'Pontuacao'
                })
                .populate({
                  path: 'item',
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
  router.route(URL + '/avaliacao/:avaliacaoId/objetoAvaliacao/csv')
    .get(JWTAuth, (req, res, next) => {
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
                  path: 'pontuacao',
                  model: 'Pontuacao'
                })
                .populate({
                  path: 'item',
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
            res.send(require('csvjson').toCSV(response, {delimiter: ';', wrap: false}))
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
                model: 'Tipo'
              }
            }
          }
        })
        .populate({
          path: 'objetoAvaliacao',
          model: 'ObjetoAvaliacao',
          populate: {
            path: 'entidade',
            model: 'Entidade'
          }
        })
        .then(response => {
          notas = response
          return Promise.all(notas.map(nota => Pontuacao.find({ item: nota.item })))
        })
        .then(response => {
          return response.reduce((notas, pontuacoes) => {
            return notas.map((nota) => {
              if (pontuacoes.length && pontuacoes[0].item && pontuacoes[0].item.toString() === nota.item._id.toString()) {
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

  router.route(URL + '/objetoAvaliacao/:objetoAvaliacaoId/nota/csv')
    .get(JWTAuth, (req, res, next) => {
      let notas = []
      let notasReady = []
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
                populate: {
                  path: 'pilar',
                  model: 'Pilar'
                }
              }
            }
          }
        })
        .populate({
          path: 'objetoAvaliacao',
          model: 'ObjetoAvaliacao',
          populate: {
            path: 'entidade',
            model: 'Entidade'
          }
        })
        .then(response => {
          notas = response
          return Promise.all(notas.map(nota => Pontuacao.find({ item: nota.item })))
        })
        .then(response => {
          return response.reduce((notas, pontuacoes) => {
            return notas.map((nota) => {
              if (pontuacoes.length && pontuacoes[0].item && pontuacoes[0].item.toString() === nota.item._id.toString()) {
                nota = nota.toObject()
                pontuacoes.sort((a, b) => a.nota - b.nota)
                nota.item.pontuacoes = pontuacoes
              }
              return nota
            })
          }, notas)
        })
        .then(response => {
          return response.map(nota => {
            nota.pilar = nota.item.subnivel.nivel.tipo ? Object.assign({}, nota.item.subnivel.nivel.tipo.pilar) : ''
            nota.item.subnivel.nivel.tipo.pilar = undefined
            nota.tipo = Object.assign({}, nota.item.subnivel.nivel.tipo)
            nota.item.subnivel.nivel.tipo = undefined
            nota.nivel = Object.assign({}, nota.item.subnivel.nivel)
            nota.item.subnivel.nivel = undefined
            nota.subnivel = Object.assign({}, nota.item.subnivel)
            nota.item.subnivel = undefined
            nota.pontuacao = nota.item ? nota.item.pontuacoes ? nota.item.pontuacoes.filter((pontuacao) => {
              if (!nota.pontuacao) return false
              return pontuacao._id.toString() === nota.pontuacao.toString()
            }).pop() : '' : ''
            nota.item.pontuacoes = undefined
            return nota
          })
        })
        .then(response => {
          return response.map(nota => {
            return {
              id: nota._id.toString(),
              observacoes: nota.observacoes,
              objetoAvaliacaoId: nota.objetoAvaliacao._id.toString(),
              objetoAvaliacaoObservacoes: nota.objetoAvaliacao.observacoes.toString(),
              entidadeId: nota.objetoAvaliacao.entidade._id.toString(),
              entidadeNome: nota.objetoAvaliacao.entidade.nome.toString(),
              entidadeEsfera: nota.objetoAvaliacao.entidade.esfera.toString(),
              entidadePoder: nota.objetoAvaliacao.entidade.poder.toString(),
              entidadePib: nota.objetoAvaliacao.entidade.pib.toString(),
              entidadePopulacao: nota.objetoAvaliacao.entidade.populacao.toString(),
              itemId: nota.item._id.toString(),
              itemNotaMaxima: nota.item.notaMaxima.toString(),
              itemExigencia: nota.item.exigencia.toString(),
              itemNome: nota.item.nome.toString(),
              pontuacaoId: nota.pontuacao ? nota.pontuacao._id.toString() : '',
              pontuacaoDescricao: nota.pontuacao ? nota.pontuacao.descricao.toString() : '',
              pontuacaoNota: nota.pontuacao ? nota.pontuacao.nota.toString() : '',
              dataAvaliacao: nota.dataAvaliacao.toString(),
              pilarId: nota.pilar._id.toString(),
              pilarDescricao: nota.pilar.descricao.toString(),
              pilarNome: nota.pilar.nome.toString(),
              tipoId: nota.tipo._id.toString(),
              tipoNome: nota.tipo.nome.toString(),
              nivelId: nota.nivel._id.toString(),
              nivelNome: nota.nivel.nome.toString(),
              subnivelId: nota.subnivel._id.toString(),
              subnivelNome: nota.subnivel.nome.toString()
            }
          })
        })
        .then(response => {
          notasReady = response
          return Promise.all(response.map(nota => {
            return ItemHasCriterioLegal.find({ item: nota.itemId })
              .populate({
                path: 'criterioLegal',
                model: 'CriterioLegal',
                populate: {
                  path: 'norma',
                  model: 'Norma'
                }
              })
          }))
        })
        .then(response => {
          return notasReady.map((notaReady, key) => {
            console.log(key)
            notaReady.criteriosLegais = response[key]
            return notaReady
          })
        })
        .then(response => {
          return response.map(resp => {
            resp.criteriosLegais = resp.criteriosLegais.map(criterioLegal => {
              return {
                criterioId: criterioLegal.criterioLegal._id.toString(),
                criterioDescricao: criterioLegal.criterioLegal.descricao.toString(),
                normaId: criterioLegal.criterioLegal.norma._id.toString(),
                normaNome: criterioLegal.criterioLegal.norma.nome.toString(),
                normaTipo: criterioLegal.criterioLegal.norma.tipo.toString()
              }
            })
            return resp
          })
        })
        .then(response => {
          res.send(require('csvjson').toCSV(response, {delimiter: ';', wrap: false}))
          next()
        })
        .catch(error => {
          console.log('Aqui?', error.message)
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })

  router.route(URL + '/pontuacao/csv')
    .get(JWTAuth, (req, res, next) => {
      return Pontuacao.find({ objetoAvaliacao: req.params.objetoAvaliacaoId })
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
          }
        })
        .then(response => {
          return response.map(pontuacao => {
            try {
              let sendBack = {
                indicadorId: pontuacao.item.subnivel.nivel.tipo.pilar.indicador._id.toString(),
                indicadorNome: pontuacao.item.subnivel.nivel.tipo.pilar.indicador.nome.toString(),
                indicadorObjetivos: pontuacao.item.subnivel.nivel.tipo.pilar.indicador.objetivos.toString(),
                pilarId: pontuacao.item.subnivel.nivel.tipo.pilar._id.toString(),
                pilarNome: pontuacao.item.subnivel.nivel.tipo.pilar.nome.toString(),
                pilarDescricao: pontuacao.item.subnivel.nivel.tipo.pilar.descricao.toString(),
                tipoId: pontuacao.item.subnivel.nivel.tipo._id.toString(),
                tipoNome: pontuacao.item.subnivel.nivel.tipo.nome.toString(),
                nivelId: pontuacao.item.subnivel.nivel._id.toString(),
                nivelNome: pontuacao.item.subnivel.nivel.nome.toString(),
                subnivelId: pontuacao.item.subnivel._id.toString(),
                subnivelNome: pontuacao.item.subnivel.nome.toString(),
                itemId: pontuacao.item._id.toString(),
                itemNotaMaxima: pontuacao.item.notaMaxima.toString(),
                itemExigencia: pontuacao.item.exigencia.toString(),
                itemNome: pontuacao.item.nome.toString(),
                pontuacaoId: pontuacao._id.toString(),
                pontuacaoDescricao: pontuacao.descricao.toString(),
                pontuacaoNota: pontuacao.nota.toString()
              }
              return sendBack
            } catch (e) {
              return {}
            }
          })
        })
        .then(response => {
          res.send(require('csvjson').toCSV(response, {delimiter: ';', wrap: false}))
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
