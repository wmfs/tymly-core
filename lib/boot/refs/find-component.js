const jp = require('jsonpath')

function findComponent (ref, components, jsonPath) {
  const [type, name] = ref.split(':')
  const obj = components[type][name]

  return [name, applyPath(obj, jsonPath)]
} // findObject

function applyPath (obj, jsonPath) {
  if (!jsonPath || !obj) return obj

  const selection = jp.query(obj, jsonPath)
  return selection.length === 1 ? selection[0] : selection
} // applyPath

module.exports = findComponent
