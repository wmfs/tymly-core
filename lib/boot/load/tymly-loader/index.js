const fs = require('fs')
const path = require('path')
const { camelCase } = require('lodash')
const loadDir = require('./load-dir')
const pathExploder = require('./path-exploder')
const processRefProperties = require('./process-ref-properties')

// Options:
//   sourceLabel

module.exports = function tymlyLoader (options) {
  const messages = options.messages
  const components = {}
  const tymlyRefs = {}
  const metaData = {}

  messages.subHeading('Loading ' + options.sourceLabel)

  const explodedPaths = pathExploder(
    options.sourcePaths,
    {
      suffix: options.suffix,
      expectModule: options.expectModule,
      messages: messages,
      excludeBaseNames: options.excludeBaseNames
    }
  )

  explodedPaths.forEach(function (rootDir) {
    if (rootDir.endsWith('/lib/components')) {
      const pluginPath = rootDir.split('/lib/components')[0]
      metaData[camelCase(path.basename(pluginPath))] = getMetaData(pluginPath)
    } else if (rootDir.endsWith('-blueprint')) {
      metaData[camelCase(path.basename(rootDir))] = getMetaData(rootDir)
    }

    loadDir(
      rootDir,
      components,
      tymlyRefs,
      options
    )
  })

  if (options.refProperties) {
    processRefProperties(
      components,
      options.refProperties,
      options.messages
    )
  }

  return {
    components,
    tymlyRefs,
    metaData
  }
} // tymlyLoader

function getMetaData (dirPath) {
  const dirContent = fs.readdirSync(dirPath)

  const fileName = dirContent.find(dir => dir === 'blueprint.json' || dir === 'plugin.json')
  if (!fileName) return

  const fileContent = fs.readFileSync(path.join(dirPath, fileName), 'utf8')
  return JSON.parse(fileContent)
}
