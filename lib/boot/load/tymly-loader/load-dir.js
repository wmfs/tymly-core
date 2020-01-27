
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const parseMetaJson = require('./parse-meta-json')
const loadComponentDir = require('./load-component-dir')
const fileLoaders = require('./file-loaders/index')
const COMPONENT_TYPE_BLACKLIST = ['test', 'nodeModules']

module.exports = function loadDir (
  rootDir,
  allComponents,
  tymlyRefs,
  options
) {
  const quiet = options.quiet || false
  const includeDocumentation = options.includeDocumentation || false

  if (!quiet) {
    options.messages.info(rootDir)
  }

  let parsedMetaJson
  if (Object.prototype.hasOwnProperty.call(options, 'expectedMetaFilename')) {
    parsedMetaJson = parseMetaJson(
      rootDir,
      options.expectedMetaFilename,
      options.mandatoryMetaKeys,
      options.messages
    )
    if (!parsedMetaJson) {
      return
    }
  }

  const rootComponents = {}

  for (const { dir, name } of findComponentTypesToLoad(rootDir)) {
    if (name === 'changelog') {
      if (!Object.prototype.hasOwnProperty.call(rootComponents, name)) rootComponents[name] = {}
      const key = _.camelCase(path.basename(path.dirname(dir)))
      rootComponents[name][key] = {
        filePath: dir,
        content: fs.readFileSync(dir, 'utf8')
      }
    } else {
      const dirContent = fs.readdirSync(dir)
      for (const filename of dirContent) {
        const key = _.camelCase(path.parse(filename).name)
        const filepath = path.join(dir, filename)
        const stats = fs.statSync(filepath)

        const loadComponent = stats.isFile()
          ? loadComponentFile
          : loadComponentDir
        const loaded = loadComponent(
          parsedMetaJson,
          key,
          filepath,
          options.messages,
          includeDocumentation
        )

        if (!loaded) continue

        if (!Object.prototype.hasOwnProperty.call(rootComponents, name)) rootComponents[name] = {}
        rootComponents[name][loaded.key] = loaded.content

        if (loaded.refs) {
          if (!Object.prototype.hasOwnProperty.call(tymlyRefs, name)) tymlyRefs[name] = {}

          tymlyRefs[name][loaded.key] = loaded.refs
        }
      }
    }
  }

  // Extracted a list of component types / keys
  // Now merge with the rest of the components
  // ------------------------------------------
  for (const [componentTypeName, components] of Object.entries(rootComponents)) {
    const existingComponents = allComponents[componentTypeName] || {}
    const mergedComponents = _.defaults(components, existingComponents)
    allComponents[componentTypeName] = mergedComponents
  } // for ...
} // loadDir

function findComponentTypesToLoad (rootDir) {
  const componentDirectories = fs.readdirSync(rootDir)
    .filter(dir => fs.statSync(path.join(rootDir, dir)).isDirectory() || dir === 'CHANGELOG.md')
    .filter(dir => dir[0] !== '.')

  const componentTypesToLoad = componentDirectories
    .map(dir => {
      let name = _.camelCase(dir)

      if (dir === 'CHANGELOG.md') name = 'changelog'

      return {
        dir: path.join(rootDir, dir),
        name
      }
    })
    .filter(component => !COMPONENT_TYPE_BLACKLIST.includes(component.name))

  return componentTypesToLoad
} // findComponentTypesToLoad

function loadComponentFile (meta, key, filepath, messages) {
  const ext = path.extname(filepath).slice(1)
  const loader = fileLoaders[ext] || fileLoaders.DEFAULT

  return loader(meta, key, filepath, messages)
} // loadComponentFile
