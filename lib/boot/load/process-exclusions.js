const _ = require('lodash')

module.exports = function processExclusions (providedExclusions) {
  // Provided an array of things to exclude, so just send that on
  if (providedExclusions) {
    if (Array.isArray(providedExclusions)) {
      return providedExclusions
    }
    if (_.isString(providedExclusions)) {
      // Provided a string (from an env variable perhaps?) so split on ; and use that array
      return providedExclusions.split(';')
    }
  }
  return []
}
