'use strict'

const boom = require('@hapi/boom')
const _ = require('lodash')

module.exports = class FindingByIds {
  init (resourceConfig, env) {
    this.modelId = resourceConfig.modelId
    const models = env.bootedServices.storage.models
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
      this.primaryKey = this.model.primaryKey || this.model.pkPropertyIds
    } else {
      throw boom.notFound('Unable to initialize FindingByIds state... unknown model \'' + this.modelId + '\'', { modelId: this.modelId })
    }
  } // init

  async run (keyArray, context) {
    if (Array.isArray(keyArray)) {
      const docs = []
      for (const key of keyArray) {
        const keyValues = this.buildKeyValues(key, this.primaryKey.length)
        if (keyValues.length === this.primaryKey.length) {
          try {
            const doc = await this.model.findById(keyValues)
            docs.push(doc)
          } catch (err) {
            context.sendTaskFailure(
              {
                error: 'FAILED_TO_FIND_BY_ID',
                cause: err
              }
            )
          }
        }
      }
      context.sendTaskSuccess(docs)
    } else {
      context.sendTaskSuccess()
    }
  } // run

  buildKeyValues (key) {
    if (Array.isArray(key)) {
      return key
    }

    if (_.isObject(key)) {
      const keyValues = this.primaryKey
        .map(pkPropertyId => key[pkPropertyId])
        .filter(pk => pk)
      return keyValues
    }

    if (!_.isUndefined(key) && !_.isNull(key)) {
      return [key]
    }

    return []
  } // buildKeyValues
} // class FindingByIds
