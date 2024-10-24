module.exports = class GetRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
  }

  run (event, context) {
    try {
      const value = this.registry.get(this.key)

      context.sendTaskSuccess(value)
    } catch (err) {
      if (event.defaultValue !== undefined) {
        return context.sendTaskSuccess(event.defaultValue)
      } // if ...

      context.sendTaskFailure({ error: 'GetConfiguredRegistryKeyFail', cause: err })
    } // catch
  } // run
} // GetRegistryKey
