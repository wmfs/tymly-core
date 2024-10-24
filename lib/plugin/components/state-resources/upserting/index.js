'use strict'
const boom = require('@hapi/boom')
const _ = require('lodash')

module.exports = class Upserting {
  init (resourceConfig, env) {
    this.setMissingPropertiesToNull = resourceConfig.setMissingPropertiesToNull || false
    this.modelId = resourceConfig.modelId
    const models = env.bootedServices.storage.models
    if (env.bootedServices.userInfo) this.userInfo = env.bootedServices.userInfo
    if (Object.prototype.hasOwnProperty.call(models, this.modelId)) {
      this.model = models[this.modelId]
    } else {
      throw boom.notFound('Unable to initialize Persisting state... unknown model \'' + this.modelId + '\'', { modelId: this.modelId })
    }
  } // init

  async run (doc, context) {
    if (!doc) {
      failed(context, 'NO_DOC_TO_UPSERT', 'Unable to save document - no document supplied')
    }

    const docToPersist = _.cloneDeep(doc)

    docToPersist._executionName = context.executionName

    this.model.upsert(docToPersist, { setMissingPropertiesToNull: this.setMissingPropertiesToNull })
      .then(docId => context.sendTaskSuccess(docId))
      .catch(err => failed(context, 'FAILED_TO_UPSERT', err))
  } // run
}

function failed (context, error, cause) {
  context.sendTaskFailure({
    error,
    cause
  })
}
