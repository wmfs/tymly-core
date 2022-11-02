module.exports = class ResetCache {
  init (resourceConfig, env) {
    this.caches = env.bootedServices.caches
  }

  run (event, context) {
    try {
      this.caches.clear(event)
      return context.sendTaskSuccess()
    } catch (err) {
      return context.sendTaskFailure({ error: 'ResetCacheFail', cause: err })
    }
  } // run
} // ResetCache
