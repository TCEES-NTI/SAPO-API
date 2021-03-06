'use strict'

const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')
const jwt = require('jsonwebtoken')
const config = require('../../keys')
const EXPIRESIN = '4h'

module.exports = (router, JWTAuth) => {
  router.route('/singup')
    .post((req, res, next) => {
      let instance = new User()
      modelAttributes.forEach((key) => {
        instance[key] = req.body[key] ? req.body[key] : instance[key]
      })
      return instance.save()
        .then(response => {
          res.json({
            message: 'User was created successfully',
            token: jwt.sign(response, config.SECRET, { expiresIn: EXPIRESIN })
          })
          next()
        })
        .catch(error => {
          res.status(403).send(error)
          next()
        })
    })
  router.route('/login')
    .post((req, res, next) => {
      User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
            throw new Error('User not found in database.')
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || !isMatch) {
              res.status(403).send('Wrong password for the provided user.')
            }
            let token = jwt.sign(user, config.SECRET, { expiresIn: EXPIRESIN })
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            })
            next()
          })
        })
        .catch((err) => {
          res.status(403).send({error: err.message})
          next()
        })
    })
    
   router.route('/username')
    .get(JWTAuth, (req, res, next) => {
      return User.find()
        .then(response => {
          res.json(response.map((user) => {
            return {
              _id: user._id,
              username: user.username,
              name: user.name
            }
          }))
          next()
        })
        .catch(error => {
          res.status(error.statusCode || 500).send(error.message)
          next()
        })
    })
    
  return router
}
