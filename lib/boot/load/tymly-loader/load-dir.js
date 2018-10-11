
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const parseMetaJson = require('./parse-meta-json')
const loadComponentDir = require('./load-component-dir')
const fileLoaders = require('./file-loaders/index')
const COMPONENT_DIR_BLACKLIST = ['test', 'nodeModules']

module.exports = function loadDir (rootDir, allComponents, options) {
  const quiet = options.quiet || false
  const includeDocumentation = options.includeDocumentation || false

  if (!quiet) {
    options.messages.info(rootDir)
  }

  let parsedMetaJson
  if (options.hasOwnProperty('expectedMetaFilename')) {
    parsedMetaJson = parseMetaJson(rootDir, options.expectedMetaFilename, options.mandatoryMetaKeys, options.messages)
    if (!parsedMetaJson) {
      return
    }
  }

  const componentDirs = fs.readdirSync(rootDir).filter(function (file) {
    return fs.statSync(path.join(rootDir, file)).isDirectory()
  })

  const rootComponents = {}

  for (const componentTypeDir of componentDirs) {
    const componentTypeName = _.camelCase(componentTypeDir)
    if (!rootComponents.hasOwnProperty(componentTypeName)) {
      rootComponents[componentTypeName] = {}
    }
    if (componentTypeDir[0] !== '.' && COMPONENT_DIR_BLACKLIST.indexOf(componentTypeName) === -1) {
      const componentDir = path.join(rootDir, componentTypeDir)
      const dirContent = fs.readdirSync(componentDir)
      for (const filename of dirContent) {
        const key = _.camelCase(path.parse(filename).name)
        const stats = fs.statSync(path.join(componentDir, filename))
        let loaded

        if (stats.isFile()) {
          const ext = path.extname(filename).slice(1)
          const loader = fileLoaders[ext] || fileLoaders.DEFAULT

          loaded = loader(parsedMetaJson, key, path.join(componentDir, filename), options.messages)
        } else {
          loaded = loadComponentDir(parsedMetaJson, key, path.join(componentDir, filename), options.messages)

          if (includeDocumentation) {
            loaded.content.doc = require(path.join(loaded.content.rootDirPath, 'doc'))
          }
        }

        if (loaded) {
          rootComponents[componentTypeName][loaded.key] = loaded.content
        }
      }
    }
  }

  // Extracted a list of component types / keys
  // Now merge with the rest of the components
  // ------------------------------------------
  for (const [ componentTypeName, components ] of Object.entries(rootComponents)) {
    const existingComponents = allComponents[componentTypeName] || {}
    const mergedComponents = _.defaults(components, existingComponents)
    allComponents[componentTypeName] = mergedComponents
  } // for ...
}
