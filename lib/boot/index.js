const loader = require('./load')
const serviceParser = require('./parse')
const booter = require('./boot')

const startupMessages = require('./../startup-messages')

async function bootTymlyServices (options, callback) {
  const messages = options.messages || startupMessages()
  options.messages = messages

  messages.reset()
  messages.title()

  const loadedComponents = loader(options)

  if (!messages.noErrors) {
    return fail('loading', messages, callback)
  }

  const parsedServices = serviceParser(
    loadedComponents.blueprintComponents,
    loadedComponents.pluginComponents,
    messages
  )

  if (!parsedServices) {
    return fail('parsing', messages, callback)
  }

  try {
    const bootedServices = await booter({
      parsedServices: parsedServices,
      pluginComponents: loadedComponents.pluginComponents,
      blueprintComponents: loadedComponents.blueprintComponents,
      pluginPaths: loadedComponents.pluginPaths,
      blueprintPaths: loadedComponents.blueprintPaths,
      config: options.config,
      messages: options.messages
    })
    messages.showAnyWarnings('booting')
    if (callback) return callback(null, bootedServices)
    return bootedServices
  } catch (err) {
    messages.error(err)

    return fail('booting', messages, callback)
  }
} // bootTymlyServices

function fail (label, messages, callback) {
  messages.showAnyWarnings('loading')
  messages.showErrors('loading')
  if (callback) {
    callback(messages.errors)
  } else {
    throw new Error(messages.error.join('\n'))
  }
} // fail

module.exports = bootTymlyServices
