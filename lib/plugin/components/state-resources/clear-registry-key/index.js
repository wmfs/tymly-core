
module.exports = class GetRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
  }

  run (event, context) {
    this.registry.clear(event.key, err => {
      if (err) return context.sendTaskFailure({ error: 'ClearRegistryKeyFail', cause: err })
      context.sendTaskSuccess()
    })
  } // run
} // GetRegistryKey
