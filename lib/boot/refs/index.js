
const firstPass = require('./first-pass')
const secondPass = require('./second-pass')
const thirdPass = require('./third-pass')

module.exports = {
  firstPass: firstPass,
  secondPass: (
    loadedComponents,
    bootedServices,
    messages
  ) => {
    secondPass(
      loadedComponents,
      bootedServices,
      messages
    )
    thirdPass(
      loadedComponents
    )
  }
}
