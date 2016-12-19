'use strict'

const keys = require('./keys')
const fs = require('fs')

let resultString = 'module.exports = {\n'

Object.keys(keys).forEach((key) => {
    resultString += key + ': "' + process.env[key] + '",\n'
})

resultString += '}'

fs.writeFile(__dirname + '/keys.js', resultString, (err) => {
    if (err) 
        return console.log(err)
    console.log('Keys overwritten')
});