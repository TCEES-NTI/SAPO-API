'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CONSTS = require('../../utils/constants')
const password = require('s-salt-pepper')
password.configure({
  pepper: require('../../../keys.js').SECRET
})

let UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: CONSTS.USER_ROLE.ADMIN }
})

UserSchema.pre('save', function (next) {
  let user = this
  if (!user.isModified('password')) {
    return next()
  }
  password.hash(user.password, function (err, salt, hash) {
    if (err) {
      return next(err)
    }
    user.password = salt + '<||>' + hash
    next()
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  var usrPwd = this.password.split('<||>')
  password.compare(candidatePassword, usrPwd[0], function (err, hash) {
    if (usrPwd[1] !== hash) {
      cb(err) 
    } else {
      cb(null, hash)
    }
  })
}

module.exports = mongoose.model('User', UserSchema)
