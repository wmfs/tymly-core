'use strict'

module.exports = class Logging {
  init (resourceConfig) {
    this.template = resourceConfig.template
  }

  run (event, context) {
    console.log(this.template)
    context.sendTaskSuccess()
  }
}
