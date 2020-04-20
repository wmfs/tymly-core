
module.exports = class SetConfiguredRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
  }

  run (event, context) {
    this.registry.set(this.key, event, function (err) {
      if (err) return context.sendTaskFailure({ error: 'SetConfiguredRegistryKeyFail', cause: err })
      context.sendTaskSuccess()
    })
  }
}
