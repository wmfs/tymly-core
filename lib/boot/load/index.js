const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const { applyPatch } = require('fast-json-patch')

const discoverBlueprintDirs = require('./discover-blueprint-dirs')
const extractRefProperties = require('./extract-ref-properties')

const tymlyLoader = require('./tymly-loader')
const pathExploder = require('./tymly-loader/path-exploder')

const COMPONENT_TYPE_IGNORE_LIST = ['test', 'nodeModules', 'shared', 'common']

function load (options) {
  options.messages.heading('Loading')

  const plugins = loadPlugins(options)

  const blueprints = loadBlueprints(plugins, options)

  const mods = loadMods(blueprints.components, options)

  return {
    pluginPaths: plugins.paths,
    pluginComponents: plugins.components,

    blueprintPaths: blueprints.paths,
    blueprintComponents: blueprints.components,
    blueprintRefs: blueprints.tymlyRefs,

    modPaths: mods.paths,
    modComponent: mods.components,
    // todo: refs?

    metaData: { ...plugins.metaData, ...blueprints.metaData }
  }
} // load

function loadMods (blueprintComponents, options) {
  const components = {}

  function applyMod (type, key, mod, result) {
    options.messages.detail(`Applying ${type} - ${key}`)

    blueprintComponents[type][key] = result || mod

    if (!components[type]) components[type] = {}

    components[type][key] = mod
  }

  function getOrigComponent (type, key) {
    if (blueprintComponents[type]) {
      if (blueprintComponents[type][key]) {
        return blueprintComponents[type][key]
      } else {
        // todo: throw error
      }
    } else {
      // todo: throw error
    }
  }

  const paths = buildPaths(options.modPaths || [])

  options.messages.subHeading('Loading mods')

  const explodedPaths = pathExploder(
    paths,
    {
      messages: options.messages,
      excludeBaseNames: processExclusions(options.excludeMods)
    }
  )

  for (const rootDir of explodedPaths) {
    options.messages.info(rootDir)

    const metaJson = require(path.join(rootDir, 'mod.json'))
    const namespace = metaJson.blueprint.namespace
    // todo: ensure metaJson has name, version, blueprint

    const modDirs = fs.readdirSync(rootDir)

    for (const dir of modDirs) {
      const dirPath = path.join(rootDir, dir)

      if (fs.statSync(dirPath).isDirectory() && dir[0] !== '.') {
        const dirType = _.camelCase(dir)

        if (!COMPONENT_TYPE_IGNORE_LIST.includes(dirType)) {
          const dirContent = fs.readdirSync(dirPath)

          for (const filename of dirContent) {
            const key = _.camelCase(path.parse(filename).name)
            const filepath = path.join(dirPath, filename)
            const stats = fs.statSync(filepath)

            if (stats.isFile()) {
              const ext = path.extname(filepath).slice(1)

              if (ext === 'json') {
                const json = require(filepath)
                const keyParts = [namespace, key]
                if (json.version) keyParts.push(json.version.replace('.', '_'))

                const componentKey = keyParts.join('_')
                const origComponent = getOrigComponent(dirType, componentKey)
                const res = applyPatch(origComponent, json.operations)
                applyMod(dirType, componentKey, json.operations, res.newDocument)
              } else {
                // todo: what if not json (e.g. replace if functions, images)

                if (dirType === 'functions') {
                  const componentKey = `${namespace}_${key}`
                  // if (getOrigComponent(dirType, componentKey)) {
                  const modifier = require(filepath)
                  applyMod(dirType, componentKey, modifier)
                  // }
                } else if (dirType === 'images') {
                  const componentKey = `${namespace}_${key}.${ext}`
                  const comp = getOrigComponent(dirType, componentKey)
                  comp.filePath = filepath
                  applyMod(dirType, componentKey, comp)
                }
              }
            } else {
              // todo: what if dir
            }
          }
        }
      }
    }
  }

  return {
    paths,
    components
  }
}

function loadPlugins (options) {
  const paths = buildPaths(
    path.resolve(__dirname, './../../plugin'),
    options.pluginPaths
  )

  const { components, metaData } = tymlyLoader({
    sourcePaths: paths,
    processRefProperties: false,
    messages: options.messages,
    suffix: 'components',
    sourceLabel: 'plugins',
    expectModule: true,
    excludeBaseNames: processExclusions(options.excludePlugins)
  })

  return {
    paths,
    components,
    metaData
  }
} // loadPlugins

function loadBlueprints (plugins, options) {
  const paths = buildPaths(
    discoverBlueprintDirs(plugins.paths, options.messages),
    options.blueprintPaths
  )

  const { components, metaData, tymlyRefs } = tymlyLoader(
    {
      sourcePaths: paths,
      messages: options.messages,
      expectModule: false,
      sourceLabel: 'blueprints',
      expectedMetaFilename: 'blueprint.json',
      mandatoryMetaKeys: ['name', 'version', 'namespace'],
      refProperties: extractRefProperties(plugins.components),
      pluginComponents: plugins.components,
      excludeBaseNames: processExclusions(options.excludeBlueprints)
    }
  )

  return {
    paths,
    components,
    metaData,
    tymlyRefs
  }
} // loadBlueprints

function buildPaths (initialPaths, optionPaths) {
  const paths = Array.isArray(initialPaths) ? initialPaths : [initialPaths]

  if (_.isString(optionPaths)) {
    paths.push(optionPaths)
  } else if (Array.isArray(optionPaths)) {
    paths.push(...optionPaths)
  } // if ...

  return paths
} // buildPaths

function processExclusions (providedExclusions) {
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

module.exports = load
