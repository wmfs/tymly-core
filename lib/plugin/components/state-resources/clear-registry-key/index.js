module.exports = class ClearRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
  }

  run (event, context) {
    this.registry.clear(event.key)
      .then(() => context.sendTaskSuccess())
      .catch(err => context.sendTaskFailure({ error: 'ClearRegistryKeyFail', cause: err }))
  } // run
} // ClearRegistryKey
