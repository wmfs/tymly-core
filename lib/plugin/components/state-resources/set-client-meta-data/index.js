module.exports = class SetClientMetaDeta {
  init (resourceConfig, env) {
    this.metaModel = env.bootedServices.storage.models.tymly_clientMetaData
  }

  async run (event, context) {
    try {
      await this.metaModel.create(event, {})
      context.sendTaskSuccess()
    } catch (e) {
      context.sendTaskFailure({ error: 'SetClientMetaDataFail', cause: e})
    }
  }
}
