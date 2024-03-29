'use strict'

const boom = require('@hapi/boom')
const resolveInputPaths = require('@wmfs/json-path-input-resolver')

class FindStateResourceBase {
  constructor (name, findFnName) {
    this.name = name
    this.findFnName = findFnName
  }

  init (resourceConfig, env) {
    this.logger = env.bootedServices.logger.child('stateResource:finding')

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
  } // init

  async run (event, context) {
    const filter = resolveInputPaths(event, this.filterTemplate)

    if (Number.isInteger(filter.page) && Number.isInteger(filter.limit)) {
      filter.offset = (filter.page - 1) * filter.limit
    }

    this.logger.debug(`Filtering model '${this.modelId}' ${JSON.stringify(filter)} - (executionName='${context.executionName}')`)

    try {
      const doc = await this.model[this.findFnName](filter)
      context.sendTaskSuccess(doc)
    } catch (err) {
      context.sendTaskFailure({
        error: 'FAILED_TO_FIND',
        cause: err
      })
    }
  } // run
} // class FindStateResourceBase

module.exports = FindStateResourceBase
