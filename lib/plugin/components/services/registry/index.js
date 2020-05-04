'use strict'

const async = require('async')
const _ = require('lodash')
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
    if (this.caches !== undefined) this.caches.defaultIfNotInConfig(cacheName, 1000)

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
        key: key
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

  substitute (namespace, source, rootPath) {
    const _this = this

    function applySubstitutions (root) {
      if (_.isArray(root)) {
        // TODO: Errm, shouldn't this be recursive?
      } else if (_.isObject(root)) {
        let rootValue
        let registryKey
        let registryValue
        for (const rootKey in root) {
          if (Object.prototype.hasOwnProperty.call(root, rootKey)) {
            rootValue = root[rootKey]

            if (_.isString(rootValue) && rootValue.substring(0, 10) === '@registry.') {
              registryKey = namespace + '_' + rootValue.slice(10)

              if (Object.prototype.hasOwnProperty.call(_this.registry, registryKey)) {
                registryValue = _this.registry[registryKey].value

                // TODO: Errm, nulls/undefined?
                root[rootKey] = registryValue
              }
            }
          }
        }
      }
    }

    let root
    for (const rootKey in source) {
      if (Object.prototype.hasOwnProperty.call(source, rootKey)) {
        root = source[rootKey]
        root = dottie.get(root, rootPath)
        applySubstitutions(root)
      }
    }

    return source
  }

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
      const regVal = this.bootedRegistry.registry[key].value
      this.caches.set(cacheName, key, regVal)
      return regVal
    }
  }

  set (key, value, callback) {
    this.registryKeyModel.upsert(
      {
        key: key,
        value: {
          value: value
        }
      },
      {}
    ).then(() => {
      this.caches.set(cacheName, key, value)
      this.refresh(callback)
    }
    ).catch(err => callback(err))
  } // set

  clear (key, callback) {
    this.registryKeyModel.destroyById(
      key
    ).then(() => {
      this.caches.del(cacheName, key)
      this.refresh(callback)
    }
    ).catch(err => callback(err))
  }
}

module.exports = {
  serviceClass: RegistryService,
  bootAfter: ['storage', 'caches'],
  bootBefore: ['statebox']
}
