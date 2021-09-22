module.exports = function findBootedServices () {
  return async function (env) {
    return env.parsedServices
      .map(({ name, componentModule }) => {
        const { bootBefore = [], bootAfter = [], refProperties = {} } = componentModule
        return {
          name,
          bootBefore,
          bootAfter,
          refProperties: Object
            .entries(refProperties)
            .reduce((acc, [key, comp]) => {
              acc.push(`${key} (${comp})`)
              return acc
            }, [])
        }
      })
  }
}