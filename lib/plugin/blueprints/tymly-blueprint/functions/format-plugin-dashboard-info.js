module.exports = function formatPluginDashboardInfo () {
  return async function (event) {
    const { components } = event
    return {
      ...components.reduce((obj, { key, value }) => {
        obj[key] = value
        return obj
      }, {})
    }
  }
}