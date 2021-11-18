module.exports = function cachesGetAll () {
  return function (env) {
    const { caches } = env.bootedServices

    return Object.keys(caches).map(key => {
      console.log(caches[key])
      const { itemCount, length, max, maxAge } = caches[key]
      console.log('??', { max, maxAge })

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
