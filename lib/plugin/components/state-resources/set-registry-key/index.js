'use strict'

module.exports = class SetRegistryKey {
  init (resourceConfig, env) {
    this.registry = env.bootedServices.registry
  }

  run (event, context) {
    this.registry.set(event.key, event.value)
      .then(() => context.sendTaskSuccess())
      .catch(err => context.sendTaskFailure({ error: 'SetRegistryKeyFail', cause: err }))
  }
}
