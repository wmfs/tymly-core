const loader = require('./load')
const serviceParser = require('./parse')
const booter = require('./boot')

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
    if (callback) {
      callback(err.errors)
    } else {
      throw err
    }
  } // catch
} // bootTymlyServices

async function bootTymly (options, messages) {
  const loadedComponents = loadComponents(
    options,
    messages
  )

  const parsedServices = parseServices(
    loadedComponents,
    messages
  )

  const bootedServices = await bootServices(
    parsedServices,
    loadedComponents,
    options,
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
  options,
  messages
) {
  try {
    const bootedServices = await booter({
      parsedServices: parsedServices,
      pluginComponents: loadedComponents.pluginComponents,
      blueprintComponents: loadedComponents.blueprintComponents,
      pluginPaths: loadedComponents.pluginPaths,
      blueprintPaths: loadedComponents.blueprintPaths,
      config: options.config,
      messages: messages
    })
    return bootedServices
  } catch (err) {
    messages.error(err)
    fail('booting', messages)
  } // catch
} // bootServices

function fail (label, messages) {
  messages.showAnyWarnings('loading')
  messages.showErrors('loading')

  const oops = new Error(messages.errors.join('\n'))
  oops.errors = messages.errors
  throw oops
} // fail

module.exports = bootTymlyServices
