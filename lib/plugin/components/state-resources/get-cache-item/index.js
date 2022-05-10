module.exports = class GetCacheItem {
  init (resourceConfig, env) {
    this.caches = env.bootedServices.caches
  }

  run (event, context) {
    const { cacheName, key } = event

    try {
      const item = this.caches.get(cacheName, key)
      return context.sendTaskSuccess(item)
    } catch (err) {
      return context.sendTaskFailure({ error: 'GetCacheItemFail', cause: err })
    }
  } // run
} // GetCacheItem
