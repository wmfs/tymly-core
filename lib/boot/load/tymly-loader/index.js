const loadDir = require('./load-dir')
const pathExploder = require('./path-exploder')

// Options:
//   sourceLabel

module.exports = function tymlyLoader (options) {
  const messages = options.messages
  const components = {}
  const tymlyRefs = {}

  messages.subHeading('Loading ' + options.sourceLabel)
  const explodedPaths = pathExploder(
    options.sourcePaths,
    {
      suffix: options.suffix,
      expectModule: options.expectModule,
      messages,
      excludeBaseNames: options.excludeBaseNames
    }
  )

  explodedPaths.forEach(function (rootDir) {
    loadDir(
      rootDir,
      components,
      tymlyRefs,
      options
    )
  })

  return {
    components,
    tymlyRefs,
    refProperties: options.refProperties
  }
} // tymlyLoader
