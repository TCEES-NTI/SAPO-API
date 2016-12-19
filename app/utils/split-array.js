'use strict'

function splitArray(arr) {
  return arr.split(',').map(el => el.trim())
}

module.exports = splitArray 
