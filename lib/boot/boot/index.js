async function bootAllServices (options) {
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
      if (err.message) {
        err.message = `Error booting ${serviceComponent.name}: ${err.message}`
      }
      throw err
    }
  }

  return bootedServices
} // bootAllServices

function bootService (serviceComponent, options, config, messages, bootedServices) {
  messages.subHeading('Booting ' + serviceComponent.name)
  const ServiceClass = serviceComponent.componentModule.serviceClass
  const service = new ServiceClass()

  const serviceOptions = {
    bootedServices,
    parsedServices: options.parsedServices,
    pluginComponents: options.pluginComponents,
    blueprintComponents: options.blueprintComponents,
    loadedMods: options.loadedMods,
    pluginPaths: options.pluginPaths,
    blueprintPaths: options.blueprintPaths,
    config,
    messages
  }

  bootedServices[serviceComponent.name] = service

  if (!service.boot) return

  const hasCallback = service.boot.length === 2

  if (hasCallback) {
    return bootWithCallback(service, serviceOptions)
  }

  return service.boot(serviceOptions)
} // bootService

function bootWithCallback (service, serviceOptions) {
  return new Promise((resolve, reject) =>
    service.boot(
      serviceOptions,
      err => err ? reject(err) : resolve()
    )
  )
} // bootWithCallback

module.exports = bootAllServices
