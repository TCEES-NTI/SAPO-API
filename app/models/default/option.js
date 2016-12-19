'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const splitArray = require('../../utils/split-array')
const CONSTS = require('../../utils/constants')

let OptionSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  trueOrFalse: Boolean,
  observation: String,
  tags: []
})

// Attributes middlewares
OptionSchema.path('tags').set(splitArray)

// Methods middlewares
const checkPermissions = (user, consts) => {
  if (!(consts instanceof Array)) {
    consts = [consts]
  }
  return new Promise((resolve, reject) => consts.indexOf(user.role) !== -1 ? resolve(true) : reject(false))
}

OptionSchema.pre('find', (next) => {
  checkPermissions(global.appState.user, [CONSTS.USER_ROLE.TEACHER, CONSTS.USER_ROLE.ADMIN])
    .then(() => {
      next()
    })
    .catch(() => {
      next({
        statusCode: 403,
        message: global.appState.user.role + ' not allowed to acces this resource.'
      })
    })
})

OptionSchema.post('find', (response) => {
  if ([CONSTS.USER_ROLE.ADMIN].indexOf(global.appState.user.role) === -1) {
    response = response.map((item) => {
      item.trueOrFalse = undefined
      return item
    })
  } else {
    response = response.map((item) => {
      item.__v = undefined
      return item
    })
  }
})

module.exports = mongoose.model('Option', OptionSchema)
