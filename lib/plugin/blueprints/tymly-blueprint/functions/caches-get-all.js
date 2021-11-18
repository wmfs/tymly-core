module.exports = function cachesGetAll () {
  return function (env) {
    const { caches } = env.bootedServices

    return Object.keys(caches).map(key => {
      const { itemCount, length, max, maxAge } = caches[key]

      return {
        key,
        itemCount, // total quantity of objects currently in cache, including stale items
        length, // total length of objects in cache
        maxAge,
        max
      }
    })
  }
}
