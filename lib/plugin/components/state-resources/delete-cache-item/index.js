module.exports = class DeleteCacheItem {
  init (resourceConfig, env) {
    this.caches = env.bootedServices.caches
  }

  run (event, context) {
    const { cacheName, key } = event

    try {
      this.caches.del(cacheName, key)
      return context.sendTaskSuccess()
    } catch (err) {
      return context.sendTaskFailure({ error: 'DeleteCacheItemFail', cause: err })
    }
  } // run
} // DeleteCacheItem
