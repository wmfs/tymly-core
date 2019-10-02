const _ = require('lodash')

module.exports = function (blueprintComponents, refProperties, messages) {
  function getFullReference (componentType, refName) {
    let matchedValue

    if (blueprintComponents[componentType]) {
      if (blueprintComponents[componentType][refName]) {
        matchedValue = refName
      } else {
        for (const [fullReference, component] of Object.entries(blueprintComponents[componentType])) {
          if (component.id === refName || component.id === refName.split('_')[1]) {
            matchedValue = fullReference
            break
          }
        }
      }
    }

    return matchedValue
  }

  function checkReference (root, key, value) {
    const fullReference = getFullReference(refProperties[key], value)

    if (!fullReference) {
      messages.error({
        name: 'referencePropertyFail',
        message: `Unable to establish full reference for ${refProperties[key]} with id '${value}'`
      })
    } else if (key !== 'categories') {
      root[key] = fullReference
    }
  }

  function scan (root) {
    if (Array.isArray(root)) {
      for (const element of root) {
        scan(element)
      }
    } else if (_.isObject(root)) {
      for (const [key, value] of Object.entries(root)) {
        if (refProperties[key] && _.isString(value) && value !== '*') {
          checkReference(root, key, value)
        } else if (refProperties[key] && Array.isArray(value)) {
          for (const val of value) {
            checkReference(root, key, val)
          }
        } else {
          scan(value)
        }
      }
    }
  }

  scan(blueprintComponents)
}
