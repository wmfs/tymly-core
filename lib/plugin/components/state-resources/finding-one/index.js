'use strict'
const boom = require('@hapi/boom')
const debug = require('debug')('findingOne')
module.exports = class FindingOne {
  init (resourceConfig, env) {
    this.modelId = resourceConfig.modelId
    this.filterTemplate = resourceConfig.filter || {}
    const models = env.bootedServices.storage.models
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
    } else {
      throw boom.notFound('Unable to initialize FindingOne state... unknown model \'' + this.modelId + '\'', { modelId: this.modelId })
    }
  }

  run (event, context) {
    const filter = context.resolveInputPaths(event, this.filterTemplate)
    debug(`Filtering model '${this.modelId}' ${JSON.stringify(filter)} - (executionName='${context.executionName}')`)
    this.model.findOne(
      filter,
      function (err, doc) {
        if (err) {
          context.sendTaskFailure(
            {
              error: 'FAILED_TO_FIND_ONE',
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
