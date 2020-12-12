'use strict'

const boom = require('@hapi/boom')
const debug = require('debug')('finding')

module.exports = class FindStateResourceBase {
  constructor (name, findFnName) {
    this.name = name
    this.findFnName = findFnName
  }

  init (resourceConfig, env) {
    if (!this.name || !this.findFnName) {
      throw boom.notFound('Unable to initialize FindStateResourceBase - not constructed properly')
    }

    this.modelId = resourceConfig.modelId
    this.filterTemplate = resourceConfig.filter || {}
    const models = env.bootedServices.storage.models
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
    } else {
      throw boom.notFound(`Unable to initialize ${this.name} state... unknown model '${this.modelId}'`, { modelId: this.modelId })
    }
  }

  run (event, context) {
    const filter = context.resolveInputPaths(event, this.filterTemplate)
    debug(`Filtering model '${this.modelId}' ${JSON.stringify(filter)} - (executionName='${context.executionName}')`)
    this.model[this.findFnName](
      filter,
      function (err, doc) {
        if (err) {
          context.sendTaskFailure(
            {
              error: 'FAILED_TO_FIND',
              cause: err
            }
          )
        } else {
          context.sendTaskSuccess(doc)
        }
      }
    )
  }
}
