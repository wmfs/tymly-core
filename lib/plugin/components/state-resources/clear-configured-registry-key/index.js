
module.exports = class ClearConfiguredRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
  }

  run (event, context) {
    this.registry.clear(this.key, err => {
      if (err) return context.sendTaskFailure({ error: 'ClearConfiguredRegistryKeyFail', cause: err })
      context.sendTaskSuccess()
    })
  }
}
