'use strict'

module.exports = function callbackFunction () {
  return function callbackFunction (options, callback) {
    callback(null, 'Hello World.')
  }
}
