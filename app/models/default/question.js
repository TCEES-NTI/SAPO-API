'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let QuestionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    default: CONSTS.QUESTION_TYPE.OBJECTIVE,
    required: true
  },
  tags: [],
  options: [{
    type: Schema.ObjectId,
    ref: 'Option'
  }],
  answer: {
    type: Schema.ObjectId,
    ref: 'Option'
  }
})

// Attributes middlewares
QuestionSchema.path('options').set(splitArray)
QuestionSchema.path('tags').set(splitArray)

const checkPermissions = (user, consts) => {
  if (!(consts instanceof Array)) {
    consts = [consts]
  }
  return new Promise((resolve, reject) => consts.indexOf(user.role) !== -1 ? resolve(true) : reject(false))
}

// Methods middlewares
QuestionSchema.pre('find', (next) => {
  checkPermissions(global.appState.user, [CONSTS.USER_ROLE.TEACHER, CONSTS.USER_ROLE.ADMIN])
    .then(() => {
      this.populate('options')
      this.populate('answer')
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
QuestionSchema.post('find', (response) => {
  if ([CONSTS.USER_ROLE.ADMIN].indexOf(global.appState.user.role) === -1) {
    response = response.map((item) => {
      item.answer = undefined
      item.__v = undefined
      return item
    })
  } else {
    response = response.map((item) => {
      item.__v = undefined
      return item
    })
  }
})

module.exports = mongoose.model('Question', QuestionSchema)
