'use strict'

const boom = require('@hapi/boom')
const _ = require('lodash')

module.exports = class FindingById {
  init (resourceConfig, env, callback) {
    this.modelId = resourceConfig.modelId
    const models = env.bootedServices.storage.models
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
      this.primaryKey = this.model.primaryKey || this.model.pkPropertyIds
      callback(null)
    } else {
      callback(boom.notFound('Unable to initialize FindingById state... unknown model \'' + this.modelId + '\'', { modelId: this.modelId }))
    }
  } // init

  run (key, context) {
    const keyValues = this.buildKeyValues(key)
    const allKeyValuesSupplied = keyValues.length === this.primaryKey.length

    if (allKeyValuesSupplied) {
      this.model.findById(
        keyValues,
        function (err, doc) {
          if (err) {
            context.sendTaskFailure(
              {
                error: 'FAILED_TO_FIND_BY_ID',
                cause: err
              }
            )
          } else {
            context.sendTaskSuccess(doc)
          }
        }
      )
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
} // class FindingById
