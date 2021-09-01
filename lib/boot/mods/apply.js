const { applyPatch } = require('fast-json-patch')

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
        mod.original = clone(original)
        const modified = modify(messages, mod.type, mod.mod, original)

        if (modified) {
          mod.modified = clone(modified)
          components.blueprintComponents[type][key] = modified
        }
      } else {
        messages.detail('Cannot find original component')
      }
    }
  }
}

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
