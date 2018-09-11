
module.exports = class ClearConfiguredRegistryKey {
  init (resourceConfig, env, callback) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
    callback(null)
  }

  run (event, context) {
    this.registry.clear(this.key, err => {
      if (err) return context.sendTaskFailure({ error: 'ClearConfiguredRegistryKeyFail', cause: err })
      context.sendTaskSuccess()
    })
  }
}
