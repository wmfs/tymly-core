const _ = require('lodash')

module.exports = function jsonFileLoader (blueprintMeta, originalKey, jsonFilePath, messages) {
  try {
    const json = readJsonFile(jsonFilePath)

    populateBlueprintDetails(json, blueprintMeta)

    populateOriginalKeyDetails(json, originalKey)

    const key = buildLoadKey(blueprintMeta, originalKey, json)

    const refs = findTymlyRefs(json)

    return {
      key: key,
      content: json,
      refs: refs
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
    ['namespace', 'namespace'],
    ['blueprintName', 'name'],
    ['blueprintVersion', 'version']
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

function findTymlyRefs (json) {
  const refs = searchForRefs(json, '$', [])

  return refs.length ? refs : null
} // findTymlyRefs

function searchForRefs (json, jsonPath, refs) {
  if (!_.isObject(json)) return

  const reference = json.$tymlyRef
  if (reference) {
    verifyTymlyRefObject(json, jsonPath)

    refs.push({
      path: jsonPath,
      ref: reference
    })

    return refs
  } // if ...

  // nothing found, continue down the tree
  if (Array.isArray(json)) {
    json.forEach((sub, index) =>
      searchForRefs(sub, `${jsonPath}[${index}]`, refs)
    )
  } else if (_.isObject(json)) {
    Object.entries(json).forEach(([name, sub]) =>
      searchForRefs(sub, `${jsonPath}.${name}`, refs)
    )
  }

  return refs
} // searchForRefs

function verifyTymlyRefObject (ref, jsonPath) {
  // tymlyRefs must look like
  // { "$tymlyRef": "some reference path" }

  if (Object.keys(ref).length !== 1) {
    throw new Error(`Malformed tymlyRef at ${jsonPath}`)
  }
} // verifyTymlyRefObject
