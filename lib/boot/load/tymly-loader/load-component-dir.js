
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
  if (blueprintMeta) {
    if (blueprintMeta.hasOwnProperty('namespace')) {
      keyParts.push(blueprintMeta.namespace)
    }
  }
  if (_.isObject(source) && source.hasOwnProperty('componentName')) {
    keyParts.push(source.componentName)
  } else {
    keyParts.push(originalKey)
  }

  const loaded = {
    key: keyParts.join('_'),
    content: {
      rootDirPath: rootDirPath,
      componentModule: source
    }
  }

  if (includeDocumentation) {
    loaded.content.doc = require(path.join(rootDirPath, 'doc'))
  }

  return loaded
} // loadComponentDir

module.exports = tryLoadComponentDir
