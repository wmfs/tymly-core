const _ = require('lodash')

module.exports = function jsonFileLoader (blueprintMeta, originalKey, jsonFilePath, messages) {
  try {
    const json = readJsonFile(jsonFilePath)

    populateBlueprintDetails(json, blueprintMeta)

    populateOriginalKeyDetails(json, originalKey)

    const key = buildLoadKey(blueprintMeta, originalKey, json)

    return {
      key: key,
      content: json
    }
  } catch (err) {
    messages.error(
      {
        name: 'jsonFileLoadFail',
        message: 'Unable to load JSON file at ' + jsonFilePath,
        body: err
      }
    )
  }
} // jsonFileLoader

function readJsonFile (jsonFilePath) {
  const json = require(jsonFilePath)
  // since we're going to muck around with this, clone it first
  return _.cloneDeep(json)
} // readJsonFile

function populateBlueprintDetails (json, blueprintMeta) {
  if (!json.hasOwnProperty('namespace')) {
    json.namespace = blueprintMeta.namespace
  }

  if (!json.hasOwnProperty('blueprintName')) {
    json.blueprintName = blueprintMeta.name
  }

  if (!json.hasOwnProperty('blueprintVersion')) {
    json.blueprintVersion = blueprintMeta.version
  }
} // populateBlueprintDetails

function populateOriginalKeyDetails (json, originalKey) {
  if (!json.hasOwnProperty('id')) {
    json.id = originalKey
  }

  if (!json.hasOwnProperty('name')) {
    json.name = originalKey
  }
} // populateKeyDetails

function buildLoadKey (blueprintMeta, originalKey, json) {
  const keyParts = [
    blueprintMeta.namespace,
    originalKey
  ]

  if (json.hasOwnProperty('version')) {
    keyParts.push(json.version.replace('.', '_'))
  }

  return keyParts.join('_')
} // buildLoadKey
