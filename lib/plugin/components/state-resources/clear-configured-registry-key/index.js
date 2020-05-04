
module.exports = class ClearConfiguredRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
  }

  run (event, context) {
    this.registry.clear(this.key)
      .then(() => context.sendTaskSuccess())
      .catch(err => context.sendTaskFailure({ error: 'ClearConfiguredRegistryKeyFail', cause: err }))
  }
}
