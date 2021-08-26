const path = require('path')

const discoverBlueprintDirs = require('./discover-blueprint-dirs')
const extractRefProperties = require('./extract-ref-properties')
const buildPaths = require('./build-paths')
const processExclusions = require('./process-exclusions')
const tymlyLoader = require('./tymly-loader')
const modLoader = require('./load-mods')

function load (options) {
  options.messages.heading('Loading')

  const plugins = loadPlugins(options)
  const blueprints = loadBlueprints(plugins, options)
  modLoader(blueprints.components, options)

  return {
    pluginPaths: plugins.paths,
    pluginComponents: plugins.components,
    blueprintPaths: blueprints.paths,
    blueprintComponents: blueprints.components,
    blueprintRefs: blueprints.tymlyRefs
  }
} // load

function loadPlugins (options) {
  const paths = buildPaths(
    path.resolve(__dirname, './../../plugin'),
    options.pluginPaths
  )

  const { components } = tymlyLoader({
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
    components
  }
} // loadPlugins

function loadBlueprints (plugins, options) {
  const paths = buildPaths(
    discoverBlueprintDirs(plugins.paths, options.messages),
    options.blueprintPaths
  )

  const { components, tymlyRefs } = tymlyLoader(
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
    tymlyRefs
  }
} // loadBlueprints

module.exports = load
