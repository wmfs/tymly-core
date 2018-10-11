
const debug = require('debug')('tymly')
const _ = require('lodash')

module.exports = function bootSequenceOrder (serviceComponents, messages) {
  let orderedServiceNames = []
  let orderedServiceComponents
  let depthLimit = _.keys(serviceComponents).length
  depthLimit = (depthLimit * depthLimit) // TODO: Errm, maths?

  messages.subHeading('Calculating boot-sequence order')

  // Because 'bootBefore' implies that the other component should boot *after*...
  // Just hack in some extra bootAfter entries ahead-of-time.
  let hasErrors = applyBootBefore(serviceComponents, messages)

  function addPriorServices (fromServiceName, rootServiceNames, depth) {
    if (depth < depthLimit) {
      if (_.isArray(rootServiceNames)) {
        rootServiceNames.forEach(
          function (serviceName) {
            if (serviceComponents.hasOwnProperty(serviceName)) {
              orderedServiceNames.push(serviceName)

              const service = serviceComponents[serviceName]
              const componentModule = service.componentModule

              if (componentModule.hasOwnProperty('bootAfter')) {
                debug(`  Service '${serviceName}' must boot after '${componentModule.bootAfter}'`)
                addPriorServices(serviceName, componentModule.bootAfter, depth + 1)
              }
            } else {
              hasErrors = true
              messages.error(
                {
                  name: 'unknownService',
                  message: 'Unable to ensure the ' + fromServiceName + ' service boots after the ' + serviceName + ' service (unknown service component \'' + serviceName + '\' )'
                }
              )
            }
          }
        )
      }
    } else {
      hasErrors = true
      messages.error(
        {
          name: 'tooDeep',
          message: 'Reached max recursive depth while trying to order services - is there a loop, or does a service boot before/after itself?'
        }
      )
    }
  }

  addPriorServices(null, _.keys(serviceComponents), 0)

  if (!hasErrors) {
    orderedServiceNames = _.reverse(orderedServiceNames)
    orderedServiceNames = _.uniq(orderedServiceNames)
    orderedServiceComponents = []
    orderedServiceNames.forEach(
      function (serviceName) {
        const serviceComponent = serviceComponents[serviceName]
        serviceComponent.name = serviceName
        orderedServiceComponents.push(serviceComponents[serviceName])
      }
    )
  }

  return orderedServiceComponents
} // bootSequenceOrder

function applyBootBefore (serviceComponents, messages) {
  let hasErrors = false

  Object.keys(serviceComponents).forEach(serviceName => {
    const componentModule = serviceComponents[serviceName].componentModule

    if (componentModule.hasOwnProperty('bootBefore')) {
      componentModule.bootBefore.forEach((bootBeforeService) => {
        const targetComponent = serviceComponents[bootBeforeService]
        if (targetComponent) {
          const targetBootAfters = targetComponent.componentModule.bootAfter || []
          if (targetBootAfters.indexOf(serviceName) === -1) {
            targetBootAfters.push(serviceName)
            targetComponent.componentModule.bootAfter = targetBootAfters
          }
          debug(`  Service '${serviceName}' must boot before  '${bootBeforeService}'`)
        } else {
          hasErrors = true
          messages.error(
            {
              name: 'bootOrderFail',
              message: `Unable to boot '${serviceName}' service before unknown service '${bootBeforeService}'`
            }
          )
        }
      })
    }
  })
  return hasErrors
} // applyBootBefore
