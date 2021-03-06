'use strict'

const _ = require('lodash')

module.exports = function extractRefProperties (components) {
  const refProperties = {}

  function findRefProperties (rootPath, rootObject) {
    if (_.isObject(rootObject) && !_.isArray(rootObject)) {
      let fullPath
      let value
      for (const key in rootObject) {
        if (Object.prototype.hasOwnProperty.call(rootObject, key)) {
          value = rootObject[key]

          if (rootPath) {
            fullPath = rootPath + '.' + key
          } else {
            fullPath = key
          }

          if (key === 'refProperties' && _.isObject(value)) {
            _.forOwn(
              value,
              function (v, k) {
                refProperties[k] = v
              }
            )
          } else {
            findRefProperties(fullPath, value)
          }
        }
      }
    }
  }

  findRefProperties(null, components)

  return refProperties
}
