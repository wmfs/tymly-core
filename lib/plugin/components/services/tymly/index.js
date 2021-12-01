'use strict'
const schema = require('./schema.json')
const _ = require('lodash')

class TymlyService {
  boot (options) {
    this.bootedServices = options.bootedServices || {}
    this.logger = options.bootedServices.logger.child('service:tymly')
    this.orderedServiceNames = options.parsedServices ? options.parsedServices.map(service => { return service.name }) : []
    this.blueprintComponents = options.blueprintComponents
  }

  async shutdown () {
    this.logger.debug('Shutting down...')
    await _.reverse(this.orderedServiceNames).forEach(service => {
      if (service !== 'tymly') {
        if (typeof this.bootedServices[service].shutdown === 'function') {
          this.logger.debug(` - ${service} (Shutting down...)`)
          this.bootedServices[service].shutdown()
        } else {
          this.logger.debug(` - ${service} (Skipped - no shutdown function)`)
        }
      }
    })
    this.logger.debug('Shutdown.')
    Object.keys(require.cache).forEach(k => { delete require.cache[k] })
  }
}

module.exports = {
  schema: schema,
  serviceClass: TymlyService
}
