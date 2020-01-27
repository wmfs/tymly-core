
const debug = require('debug')('tymly')
const _ = require('lodash')

class Sequencer {
  constructor (serviceComponents, messages) {
    this.serviceComponents = serviceComponents
    this.messages = messages
    this.hasErrors = false
    this.orderedServiceNames = []

    this.applyBootBefore()

    const depthLimit = Math.pow(Object.keys(serviceComponents).length, 2)

    this.addPriorServices(null, Object.keys(serviceComponents), 0, depthLimit)

    this.orderedServiceNames.reverse()
    this.orderedServiceNames = _.uniq(this.orderedServiceNames)
  } // constructor

  get orderedServiceComponents () {
    if (this.hasErrors) return

    const orderedServiceComponents = []
    for (const serviceName of this.orderedServiceNames) {
      const serviceComponent = this.serviceComponents[serviceName]
      serviceComponent.name = serviceName
      orderedServiceComponents.push(serviceComponent)
    }
    return orderedServiceComponents
  } // get

  applyBootBefore () {
    for (const [serviceName, serviceComponent] of Object.entries(this.serviceComponents)) {
      const componentModule = serviceComponent.componentModule

      for (const bootBeforeService of listBootBefore(componentModule)) {
        const targetComponent = this.serviceComponents[bootBeforeService]
        if (targetComponent) {
          const targetBootAfters = targetComponent.componentModule.bootAfter || []
          if (targetBootAfters.indexOf(serviceName) === -1) {
            targetBootAfters.push(serviceName)
            targetComponent.componentModule.bootAfter = targetBootAfters
          }
          debug(`  Service '${serviceName}' must boot before  '${bootBeforeService}'`)
        } else {
          this.error(
            'bootOrderFail',
            `Unable to boot '${serviceName}' service before unknown service '${bootBeforeService}'`
          )
        }
      } // for ...
    } // for ...
  } // applyBootBefore

  addPriorServices (fromServiceName, rootServiceNames, depth, depthLimit) {
    if (depth === depthLimit) {
      this.error(
        'tooDeep',
        'Reached max recursive depth while trying to order services - is there a loop, or does a service boot before/after itself?'
      )
    }

    if (!Array.isArray(rootServiceNames)) return

    for (const serviceName of rootServiceNames) {
      if (Object.prototype.hasOwnProperty.call(this.serviceComponents, serviceName)) {
        this.orderedServiceNames.push(serviceName)

        const service = this.serviceComponents[serviceName]
        const componentModule = service.componentModule

        if (Object.prototype.hasOwnProperty.call(componentModule, 'bootAfter')) {
          debug(`  Service '${serviceName}' must boot after '${componentModule.bootAfter}'`)
          this.addPriorServices(serviceName, componentModule.bootAfter, depth + 1, depthLimit)
        }
      } else {
        this.error(
          'unknownService',
          'Unable to ensure the ' + fromServiceName + ' service boots after the ' + serviceName + ' service (unknown service component \'' + serviceName + '\' )'
        )
      }
    } // for ...
  } // addPriorServices

  error (name, message) {
    this.hasErrors = true
    this.messages.error({
      name,
      message
    })
  } // error
} // class Sequencer

function listBootBefore (componentModule) {
  if (!Object.prototype.hasOwnProperty.call(componentModule, 'bootBefore')) {
    return []
  }

  const bootBefore = componentModule.bootBefore
  return Array.isArray ? bootBefore : [bootBefore]
} // listBootBefore

module.exports = function bootSequenceOrder (serviceComponents, messages) {
  messages.subHeading('Calculating boot-sequence order')

  const sequencer = new Sequencer(serviceComponents, messages)
  return sequencer.orderedServiceComponents
} // bootSequenceOrder
