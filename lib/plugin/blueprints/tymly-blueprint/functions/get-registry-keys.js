module.exports = function getRegistryKeys () {
  return async function (env) {
    const model = env.bootedServices.storage.models.tymly_registryKey
    const records = await model.find({
      fields: ['key', 'created', 'createdBy', 'modified', 'modifiedBy'],
      orderBy: ['key']
    })
    return records.map(r => {
      r.launches = [
        {
          title: 'View',
          stateMachineName: 'tymly_viewRegistryKey_1_0',
          input: { key: r.key }
        }
      ]
      return r
    })
  }
}
