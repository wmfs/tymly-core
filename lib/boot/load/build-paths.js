const _ = require('lodash')

module.exports = function buildPaths (initialPaths, optionPaths) {
  const paths = Array.isArray(initialPaths) ? initialPaths : [initialPaths]

  if (_.isString(optionPaths)) {
    paths.push(optionPaths)
  } else if (Array.isArray(optionPaths)) {
    paths.push(...optionPaths)
  } // if ...

  return paths
}
