'use strict'

const boom = require('@hapi/boom')
const _ = require('lodash')

module.exports = class DeletingById {
  init (resourceConfig, env) {
    this.modelId = resourceConfig.modelId
    const models = env.bootedServices.storage.models
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
      this.primaryKey = this.model.primaryKey || this.model.pkPropertyIds
    } else {
      throw boom.notFound('Unable to initialize DeletingById state... unknown model \'' + this.modelId + '\'', { modelId: this.modelId })
    }
  }

  run (key, context) {
    let allKeyValuesSupplied = true
    let keyValues
    if (_.isObject(key)) {
      keyValues = []
      this.primaryKey.forEach(
        function (pkPropertyId) {
          const value = key[pkPropertyId]
          if (_.isUndefined(value)) {
            allKeyValuesSupplied = false
          } else {
            keyValues.push(value)
          }
        }
      )
    } else {
      if (_.isArray(key)) {
        keyValues = key
      } else {
        if (_.isUndefined(key) || _.isNull(key)) {
          allKeyValuesSupplied = false
        } else {
          keyValues = [key]
        }
      }
    }

    if (allKeyValuesSupplied) {
      this.model.destroyById(
        keyValues,
        function (err, doc) {
          if (err) {
            context.sendTaskFailure(
              {
                error: 'FAILED_TO_DESTORY_BY_ID',
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
  }
}
