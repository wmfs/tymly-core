'use strict'

const dottie = require('dottie')

const cacheName = 'registryKeys'

function callbackify (promise, callback) {
  promise
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
const NotSet = 'NotSet'

class RegistryService {
  async boot (options) {
    const storage = options.bootedServices.storage
    this.caches = options.bootedServices.caches
    if (this.caches !== undefined) {
      this.caches.defaultIfNotInConfig(cacheName, { max: 1000 })
    }

    this.bootedRegistry = options.bootedServices.registry

    this.registry = {}
    this.registryKeyModel = storage.models.tymly_registryKey // describes the registry-key table (columns, etc.)
    this.blueprintRegistryKeys = options.blueprintComponents.registryKeys || {} // the registry-keys from the blueprint

    await this.ensureBlueprintKeys(options.messages)
    await this.refresh()
    options.messages.info('Registry loaded')
  }

  /*
  * If the registry key already exists in DB then do nothing,
  * else create the row in the DB
  * */
  async ensureBlueprintKeys (messages, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.ensureBlueprintKeys(messages), callback)
    }

    if (!this.blueprintRegistryKeys) return

    for (const [key, value] of Object.entries(this.blueprintRegistryKeys)) {
      const createConfig = {
        key
      }

      const doc = await this.registryKeyModel.findById(key)
      if (!doc) {
        // Key not in storage, go create
        const environmentVariableName = dottie.get(value, 'schema.properties.environmentVariableName')
        let defaultValue
        if (process.env[environmentVariableName]) {
          defaultValue = process.env[environmentVariableName]
          createConfig.environmentVariableName = environmentVariableName
        } else {
          defaultValue = dottie.get(value, 'schema.properties.value.default') || null
        }
        createConfig.value = { value: defaultValue }
        await this.registryKeyModel.create(createConfig, {})
        messages.info('Added key: ' + key + ' = ' + defaultValue)
      }
    } // for ...
  }

  /**
   * Reloads all registry key/values from storage (i.e. the `tymly_registryKey_1_0` model)
   * @param {Function} callback Called with all key/value pairs currently stored in the registry
   * @returns {undefined}
   * @example
   * registry.refresh(
   *   function (err, registryKeyValues) {
   *     // Actually 'registryKeyValues' is more:
   *     // {
   *     //   mkKey: {
   *     //     value: 'VALUE!', <--- Value of the 'myKey' key
   *     //     meta: {...} <--- Some info about the key
   *     //   }
   *     // }
   *   }
   * )
   */
  async refresh (callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.refresh(), callback)
    }

    const storedRegistry = await this.registryKeyModel.find({})
    this.registry = storedRegistry
      .reduce((result, value) => {
        result[value.key] = {
          value: value.value.value, // Easy now
          meta: this.blueprintRegistryKeys[value.key]
        }
        return result
      }, {})
  } // refresh

  has (key) {
    const path = this.caches.get(cacheName, key)
    const reg = this.bootedRegistry.registry[key]
    return !!(path || reg)
  }

  get (key) {
    const path = this.caches.get(cacheName, key)
    if (path) {
      return path
    } else {
      const regVal = this.bootedRegistry.registry[key]

      if (!regVal) {
        throw new Error(`Cannot find registry value for key: ${key}`)
      } else {
        this.caches.set(cacheName, key, regVal.value)
        return regVal.value
      }
    }
  }

  async set (key, value, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.set(key, value), callback)
    }

    await this.registryKeyModel.upsert(
      {
        key,
        value: {
          value
        }
      },
      {}
    )
    this.caches.set(cacheName, key, value)
    await this.refresh()
  } // set

  async clear (key, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.clear(key), callback)
    }
    await this.registryKeyModel.destroyById(key)
    this.caches.delete(cacheName, key)
    await this.refresh()
  }
}

module.exports = {
  serviceClass: RegistryService,
  bootAfter: ['storage', 'caches'],
  bootBefore: ['statebox']
}
