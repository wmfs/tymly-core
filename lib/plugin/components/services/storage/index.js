const MemoryModel = require('./Memory-model')

class MemoryStorageService {
  boot (options) {
    this.logger = options.bootedServices.logger // .child({ key: 'tymly' })
    this.storageName = 'memory'
    this.models = {}

    infoMessage(options.messages, 'Using MemoryStorage...')

    this._createModels(options.blueprintComponents.models, options.messages)

    this._insertMultipleSeedData(options.blueprintComponents.seedData, options.messages)
  } // boot

  currentUser () {
    if (!this.user) {
      return null
    }
    if (typeof this.user === 'function') {
      return this.user()
    }
    return this.user
  } // currentUser

  setCurrentUser (user) {
    this.user = user
  }

  _createModels (modelDefinitions, messages) {
    if (!modelDefinitions) {
      return
    } // if (!modelDefinitions

    for (const [name, definition] of Object.entries(modelDefinitions)) {
      this.addModel(name, definition, messages)
    } // for ...
  } // addModels

  addModel (name, definition, messages) {
    if (!name || !definition) {
      return
    } // if ...

    if (this.models[name]) {
      detailMessage(messages, `${name} already defined in MemoryStorage`)
      return this.models[name]
    } // if ...

    detailMessage(messages, `Adding ${name} to MemoryStorage`)
    this.models[name] = new MemoryModel(definition, this)
    return this.models[name]
  } // addModel

  _insertMultipleSeedData (seedDataArray, messages) {
    if (!seedDataArray) {
      return
    }
    infoMessage(messages, 'Loading seed data:')

    for (const seedData of Object.values(seedDataArray)) {
      this._insertSeedData(seedData, messages)
    }
  } // insertMultipleSeedData

  _insertSeedData (seedData, messages) {
    const name = `${seedData.namespace}_${seedData.name}`
    const model = this.models[name]
    if (!model) {
      return detailMessage(messages, `WARNING: seed data found for model ${name}, but no such model was found`)
    }

    detailMessage(messages, name)
    for (const row of seedData.data) {
      // construct document
      const doc = {}
      for (const [index, name] of seedData.propertyNames.entries()) {
        // doc[_.snakeCase(name)] = row[index]
        doc[name] = row[index]
      }

      this.logger.debug(doc.user_id)
      // persist document
      this.logger.debug('persisting document', doc)
      model.upsert(doc, {}, () => {}) // In-memory is sync really (so this is OK)
    }
  } // insertSeedData
} // class MemoryStorageService

function detailMessage (messages, msg) {
  if (!messages) {
    return
  }

  messages.detail(msg)
} // detailMessage

function infoMessage (messages, msg) {
  if (!messages) {
    return
  }

  messages.info(msg)
} // infoMessage

module.exports = {
  serviceClass: MemoryStorageService,
  refProperties: {
    modelId: 'models'
  },
  bootAfter: ['caches']
}
