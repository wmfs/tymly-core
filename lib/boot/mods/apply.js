const { applyPatch } = require('fast-json-patch')
const searchForRefs = require('../load/tymly-loader/search-for-refs')

const clone = e => typeof e === 'object' ? JSON.parse(JSON.stringify(e)) : e

module.exports = function (options, mods, components) {
  const {
    messages
  } = options

  messages.heading('Applying mods')

  for (const type of Object.keys(mods)) {
    for (const [key, mod] of Object.entries(mods[type])) {
      messages.info(`Applying ${type} - ${key}`)

      const original = findOriginal(components, type, key)

      if (original) {
        mod.originalComponent = clone(original)
        const modified = modify(messages, mod.type, mod.mod, original)

        if (modified) {
          mod.modifiedComponent = clone(modified)
          components.blueprintComponents[type][key] = modified
        }

        if (mod.type === 'json') {
          mod.originalRefs = findExistingRefs(components, type, key) || []
          mod.modifiedRefs = searchForRefs(modified, '$', []) || []

          if (!components.blueprintRefs[type]) components.blueprintRefs[type] = {}

          components.blueprintRefs[type][key] = mod.modifiedRefs
        }
      } else {
        messages.detail('Cannot find original component')
      }
    }
  }
}

function findExistingRefs (components, type, key) {
  if (!components.blueprintRefs[type]) return
  return components.blueprintRefs[type][key]
} // findExistingRefs

function findOriginal (components, type, key) {
  if (!components.blueprintComponents[type]) return
  return components.blueprintComponents[type][key]
} // findOriginal

function modify (messages, type, mod, original) {
  if (type === 'json') {
    return applyJson(original, mod)
  } else if (type === 'functions' || type === 'images') {
    return mod
  } else {
    messages.detail(`Mod type not recognised: ${type}`)
  }
} // modify

function applyJson (originalComponent, mod) {
  const res = applyPatch(originalComponent, mod.operations)
  return res.newDocument
} // applyJson
