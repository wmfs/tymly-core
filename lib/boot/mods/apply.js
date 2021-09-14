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
        if (mod.type === 'json') {
          messages.detail('Cannot find original component')
        } else {
          messages.detail('Adding as new component')
          components.blueprintComponents[type][key] = mod.mod
        }
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
  } else if (['functions', 'images', 'pgScripts'].includes(type)) {
    return mod
  } else {
    messages.detail(`Mod type not recognised: ${type}`)
  }
} // modify

function applyJson (originalComponent, mod) {
  let error

  if (!mod) error = 'Cannot apply mod because it is not specified'
  if (!mod.operations) error = 'Cannot apply mod because operations is not specified'
  if (!Array.isArray(mod.operations)) error = 'Cannot apply mod because operations is not an array'

  if (error) {
    console.log(error)
    return
  }

  try {
    const res = applyPatch(originalComponent, mod.operations)
    return res.newDocument
  } catch (error) {
    console.log(error)
    return
  }
} // applyJson
