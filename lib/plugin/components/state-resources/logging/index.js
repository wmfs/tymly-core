'use strict'

module.exports = class Logging {
  init (resourceConfig, env) {
    const loggerService = env.bootedServices.logger
    this.logger = loggerService.child('stateResource:logging')
    this.template = resourceConfig.template
    this.level = loggerService.isValidLevel(resourceConfig.level) ? resourceConfig.level : 'info'
  }

  run (event, context) {
    this.logger[this.level](this.template)
    context.sendTaskSuccess()
  }
}
