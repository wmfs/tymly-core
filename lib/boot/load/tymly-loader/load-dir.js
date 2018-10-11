
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const parseMetaJson = require('./parse-meta-json')
const loadComponentDir = require('./load-component-dir')
const fileLoaders = require('./file-loaders/index')
const COMPONENT_TYPE_BLACKLIST = ['test', 'nodeModules']

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

  const componentDirectories = fs.readdirSync(rootDir)
    .filter(dir => fs.statSync(path.join(rootDir, dir)).isDirectory())
    .filter(dir => dir[0] !== '.')

  const componentTypesToLoad = componentDirectories
    .map(dir => {
      return {
        dir: path.join(rootDir, dir),
        name: _.camelCase(dir)
      }
    })
    .filter(component => !COMPONENT_TYPE_BLACKLIST.includes(component.name))

  const rootComponents = {}

  for (const { dir, name } of componentTypesToLoad) {
    const dirContent = fs.readdirSync(dir)
    for (const filename of dirContent) {
      const key = _.camelCase(path.parse(filename).name)
      const filepath = path.join(dir, filename)
      const stats = fs.statSync(filepath)
      let loaded

      if (stats.isFile()) {
        loaded = loadComponentFile(parsedMetaJson, key, filepath, options.messages)
      } else {
        loaded = loadComponentDir(parsedMetaJson, key, filepath, options.messages, includeDocumentation)
      }

      if (loaded) {
        if (!rootComponents.hasOwnProperty(name)) rootComponents[name] = {}
        rootComponents[name][loaded.key] = loaded.content
      } // if loaded
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
} // loadDir

function loadComponentFile (meta, key, filepath, messages) {
  const ext = path.extname(filepath).slice(1)
  const loader = fileLoaders[ext] || fileLoaders.DEFAULT

  return loader(meta, key, filepath, messages)
} // loadComponentFile
