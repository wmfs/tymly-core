const path = require('path')

function parseMetaJson (metaJsonPath, mandatoryMetaKeys, messages) {
  const meta = require(metaJsonPath)

  let hasMandatoryKeys = true
  for (const mandatoryKey of mandatoryMetaKeys) {
    if (!meta.hasOwnProperty(mandatoryKey)) {
      hasMandatoryKeys = false
      messages.error({
        name: 'noNamespace',
        message: 'No valid ' + mandatoryKey + ' defined in ' + metaJsonPath
      })
    } // if ...
  } // for ...

  return hasMandatoryKeys ? meta : undefined
} // parseMetaJson

function tryParseMetaJson (rootDir, expectedMetaFilename, mandatoryMetaKeys, messages) {
  // TODO: If dir has blueprint.json on the end then don't bother appending.
  const metaJsonPath = path.join(rootDir, expectedMetaFilename)
  try {
    return parseMetaJson(metaJsonPath, mandatoryMetaKeys, messages)
  } catch (err) {
    messages.error({
      name: 'blueprintJsonFail',
      message: 'Unable to load blueprint.json file at ' + metaJsonPath,
      body: err
    })
  }
} // tryParseMetaJson

module.exports = tryParseMetaJson
