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
  const properties = [
    [ 'namespace', 'namespace' ],
    [ 'blueprintName', 'name' ],
    [ 'blueprintVersion', 'version' ]
  ]

  properties
    .filter(([jsonProp]) => !json.hasOwnProperty(jsonProp))
    .forEach(([jsonProp, blueprintProp]) => {
      json[jsonProp] = blueprintMeta[blueprintProp]
    })
} // populateBlueprintDetails

function populateOriginalKeyDetails (json, originalKey) {
  const properties = [
    'id',
    'name'
  ]

  properties
    .filter(jsonProp => !json.hasOwnProperty(jsonProp))
    .forEach(jsonProp => {
      json[jsonProp] = originalKey
    })
} // populateKeyDetails

function buildLoadKey (blueprintMeta, originalKey, json) {
  const keyParts = [
    blueprintMeta.namespace,
    originalKey
  ]

  if (json.version) {
    keyParts.push(json.version.replace('.', '_'))
  }

  return keyParts.join('_')
} // buildLoadKey
