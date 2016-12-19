'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let EvaluationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [],
  questions: [{
    type: Schema.ObjectId,
    ref: 'Question'
  }]
})

EvaluationSchema.path('tags').set(splitArray)
EvaluationSchema.path('questions').set(splitArray)

const checkPermissions = (user, consts) => {
  if (!(consts instanceof Array)) {
    consts = [consts]
  }
  return new Promise((resolve, reject) => consts.indexOf(user.role) !== -1 ? resolve(true) : reject(false))
}

// Methods middlewares
EvaluationSchema.pre('find', (next) => {
  checkPermissions(global.appState.user, [CONSTS.USER_ROLE.TEACHER, CONSTS.USER_ROLE.ADMIN])
    .then(() => {
      this.populate('questions')
      next()
    })
    .catch(() => {
      next({
        statusCode: 403,
        message: global.appState.user.role + ' not allowed to acces this resource.'
      })
    })
})

// Methods middlewares
EvaluationSchema.post('find', (response) => {
  response.map((item) => {
    item.__v = undefined
    return item
  })
})

module.exports = mongoose.model('Evaluation', EvaluationSchema)
