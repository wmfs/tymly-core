
module.exports = class SetConfiguredRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
    this.key = resourceConfig.key
  }

  run (event, context) {
    this.registry.set(this.key, event)
      .then(() => context.sendTaskSuccess())
      .catch(err => context.sendTaskFailure({ error: 'SetConfiguredRegistryKeyFail', cause: err }))
  }
}
