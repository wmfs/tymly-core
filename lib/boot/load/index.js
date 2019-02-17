const path = require('path')
const _ = require('lodash')
const discoverBlueprintDirs = require('./discover-blueprint-dirs')
const extractRefProperties = require('./extract-ref-properties')

const tymlyLoader = require('./tymly-loader')

function load (options) {
  options.messages.heading('Loading')

  const plugins = loadPlugins(options)

  const blueprints = loadBlueprints(plugins, options)
  return {
    pluginPaths: plugins.paths,
    pluginComponents: plugins.components,
    blueprintPaths: blueprints.paths,
    blueprintComponents: blueprints.components
  }
} // load

function loadPlugins (options) {
  const paths = buildPaths(
    path.resolve(__dirname, './../../plugin'),
    options.pluginPaths
  )

  const components = tymlyLoader(
    {
      sourcePaths: paths,
      processRefProperties: false,
      messages: options.messages,
      suffix: 'components',
      sourceLabel: 'plugins',
      expectModule: true,
      excludeBaseNames: processExclusions(options.excludePlugins)

    }
  )

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

  const components = tymlyLoader(
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
    components
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
