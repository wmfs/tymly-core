
async function bootAllServices (options, callback) {
  //  Options
  //  parsedServices
  //  pluginComponents
  //  blueprintComponents
  //  config,

  const messages = options.messages

  messages.heading('Booting')

  const bootedServices = {}

  const config = options.config || {}

  for (const serviceComponent of options.parsedServices) {
    try {
      await bootService(serviceComponent, options, config, messages, bootedServices)
    } catch (err) {
      err.message = `Error booting ${serviceComponent.name}: ${err.message}`
      messages.error(err)
      messages.showErrors('booting')
      return callback(err)
    }
  }

  messages.showAnyWarnings('booting')
  callback(null, bootedServices)
} // bootAllServices

function bootService (serviceComponent, options, config, messages, bootedServices) {
  const booter = new Promise((resolve, reject) => {
    try {
      doBootService(serviceComponent, options, config, messages, bootedServices, err => {
        if (err) { reject(err) } else { resolve() }
      })
    } catch (err) {
      reject(err)
    }
  })
  return booter
} // bootService

function doBootService (serviceComponent, options, config, messages, bootedServices, callback) {
  messages.subHeading('Booting ' + serviceComponent.name)
  const ServiceClass = serviceComponent.componentModule.serviceClass
  const service = new ServiceClass()

  bootedServices[serviceComponent.name] = service

  service.boot(
    {
      bootedServices: bootedServices,
      parsedServices: options.parsedServices,
      pluginComponents: options.pluginComponents,
      blueprintComponents: options.blueprintComponents,
      pluginPaths: options.pluginPaths,
      blueprintPaths: options.blueprintPaths,
      config: config,
      messages: messages
    },
    callback
  )
} // doBootService

module.exports = bootAllServices
