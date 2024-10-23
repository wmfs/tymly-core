
const _ = require('lodash')
const path = require('path')

function tryLoadComponentDir (blueprintMeta, originalKey, rootDirPath, messages, includeDocumentation = false) {
  try {
    return loadComponentDir(blueprintMeta, originalKey, rootDirPath, includeDocumentation)
  } catch (err) {
    messages.error({
      name: 'componentDirFail',
      message: 'Unable to load component from ' + rootDirPath,
      body: err
    })
  } // catch
} // tryLoadComponentDir

function loadComponentDir (blueprintMeta, originalKey, rootDirPath, includeDocumentation) {
  // Looks weird to differentiate class exports
  const raw = require(rootDirPath)
  const cloned = _.cloneDeep(raw)
  let source
  if (_.keys(raw) === _.keys(cloned)) {
    source = cloned
  } else {
    source = raw
  }

  const keyParts = []
  if (hasProperty(blueprintMeta, 'namespace')) {
    keyParts.push(blueprintMeta.namespace)
  }

  keyParts.push(hasProperty(source, 'componentName') ? source.componentName : originalKey)

  const loaded = {
    key: keyParts.join('_'),
    content: {
      rootDirPath,
      componentModule: source
    }
  }

  if (includeDocumentation) {
    loaded.content.doc = require(path.join(rootDirPath, 'doc'))
  }

  return loaded
} // loadComponentDir

function hasProperty (obj, prop) {
  return _.isObject(obj) && Object.prototype.hasOwnProperty.call(obj, prop)
} // hasProperty

module.exports = tryLoadComponentDir
