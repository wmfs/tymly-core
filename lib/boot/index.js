const loader = require('./load')
const serviceParser = require('./parse')
const booter = require('./boot')
const refResolver = require('./refs')
const loadMods = require('./mods/load')
const applyMods = require('./mods/apply')
const processRefProperties = require('./load/tymly-loader/process-ref-properties')

const startupMessages = require('./../startup-messages')

async function bootTymlyServices (options, callback) {
  const messages = options.messages || startupMessages()
  options.messages = messages

  messages.reset()
  messages.title()

  try {
    const bootedServices = await bootTymly(options, messages)

    messages.showAnyWarnings('booting')

    if (callback) return callback(null, bootedServices)

    return bootedServices
  } catch (err) {
    console.log('Error booting', err)
    if (callback) {
      callback(err.errors)
    } else {
      throw err
    }
  } // catch
} // bootTymlyServices

async function bootTymly (options, messages) {
  const loadedComponents = loadComponents(options, messages)
  const loadedMods = loadMods(options)

  applyMods(options, loadedMods, loadedComponents)

  processRefProperties(
    loadedComponents.blueprintComponents,
    loadedComponents.blueprintRefProperties,
    messages
  )

  preBootTymlyRefResolution(
    loadedComponents,
    messages
  )

  const parsedServices = parseServices(
    loadedComponents,
    messages
  )

  const bootedServices = await bootServices(
    parsedServices,
    loadedComponents,
    loadedMods,
    options,
    messages
  )

  await postBootTymlyRefResolution(
    loadedComponents,
    bootedServices,
    messages
  )

  return bootedServices
} // bootTymly

function loadComponents (options, messages) {
  const loadedComponents = loader(options)

  if (!messages.noErrors) {
    fail('loading', messages)
  }

  return loadedComponents
} // loadComponents

function preBootTymlyRefResolution (loadedComponents, messages) {
  try {
    refResolver.firstPass(loadedComponents, messages)
  } catch (err) {
    messages.error(err)
    fail('pre-boot ref resolution', messages)
  } // catch
} // preBootTymlyRefResolution

function parseServices (loadedComponents, messages) {
  const parsedServices = serviceParser(
    loadedComponents.blueprintComponents,
    loadedComponents.pluginComponents,
    messages
  )

  if (!parsedServices) {
    fail('parsing', messages)
  }

  return parsedServices
} // parseServices

async function bootServices (
  parsedServices,
  loadedComponents,
  loadedMods,
  options,
  messages
) {
  try {
    const bootedServices = await booter({
      parsedServices,
      pluginComponents: loadedComponents.pluginComponents,
      blueprintComponents: loadedComponents.blueprintComponents,
      pluginPaths: loadedComponents.pluginPaths,
      blueprintPaths: loadedComponents.blueprintPaths,
      loadedMods,
      config: options.config,
      messages
    })
    return bootedServices
  } catch (err) {
    messages.error(err)
    fail('booting', messages)
  } // catch
} // bootServices

async function postBootTymlyRefResolution (
  loadedComponents,
  bootedServices,
  messages
) {
  try {
    await refResolver.secondPass(
      loadedComponents,
      bootedServices,
      messages
    )
  } catch (err) {
    messages.error(err)
    fail('post-boot ref resolution', messages)
  } // catch
} // preBootTymlyRefResolution

function fail (label, messages) {
  messages.showAnyWarnings('loading')
  messages.showErrors('loading')

  const oops = new Error(messages.errors.join('\n'))
  oops.errors = messages.errors
  throw oops
} // fail

module.exports = bootTymlyServices
