const dottie = require('dottie')

// First pass through the references. None of the services
// have yet been booted, but we can resolve static references
function firstPass (loadedComponents, messages) {
  messages.heading('Reference resolution - first pass')

  const components = loadedComponents.blueprintComponents
  const tymlyRefs = loadedComponents.blueprintRefs
  if (Object.keys(tymlyRefs).length === 0) {
    messages.subHeading('Nothing to resolve')
    return
  }

  for (const [type, referees] of Object.entries(tymlyRefs)) {
    for (const [targetName, references] of Object.entries(referees)) {
      const targetObj = components[type][targetName]
      for (const { path, ref } of references) {
        firstPassResolver(targetName, targetObj, path, ref, components, messages)
      }
    }
  }
} // firstPass

function firstPassResolver (
  targetName,
  targetObj,
  targetPath,
  ref,
  components,
  messages
) {
  const refParts = ref.split(':')
  if (refParts.length !== 2) {
    return
  }

  const [ refType, refName ] = refParts
  const refObj = components[refType][refName]

  if (!refObj) {
    throw new Error(`Could not resolve '${ref}' in ${targetName}`)
  }

  const dottiePath = jp2dp(targetPath)
  dottie.set(targetObj, dottiePath, refObj)

  messages.info(`Resolved ${ref} in ${targetName}`)
} // firstPassResolver

function jp2dp (targetPath) {
  return targetPath
    .replace('$.', '')
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
}

module.exports = {
  firstPass
}
