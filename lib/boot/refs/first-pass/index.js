const dottie = require('dottie')

// First pass through the references. None of the services
// have yet been booted, but we can resolve static references
function firstPass (loadedComponents, messages) {
  messages.heading('Reference resolution - first pass')

  const components = loadedComponents.blueprintComponents
  const tymlyRefs = loadedComponents.blueprintRefs

  const toResolve = findFirstPassReferences(tymlyRefs, components)

  if (!toResolve) {
    messages.subHeading('Nothing to resolve')
    return
  }

  resolveReferences(toResolve, components, messages)
} // firstPass

function findFirstPassReferences (tymlyRefs, components) {
  const firstPass = [ ]

  for (const [type, referees] of Object.entries(tymlyRefs)) {
    for (const [targetName, references] of Object.entries(referees)) {
      const target = `${type}:${targetName}`

      const firstPassRefs = references
        .filter(ref => canResolve(ref.ref, components))
      firstPassRefs.forEach(r =>
        firstPass.push({
          target: target,
          path: r.path,
          ref: r.ref
        })
      )

      firstPassRefs.forEach(r => { r.when = 'firstPass'})
    } // refs
  } // for ...

  return firstPass.length ? firstPass : null
} // firstPassReferences

function canResolve (reference, components) {
  const refParts = reference.split(':')
  return (refParts.length === 2) && (components[refParts[0]])
} // canResolve

function resolveReferences (toResolve, components, messages) {
  for (const { target, path, ref } of toResolve) {
    const [ targetName, targetObj ] = findObject(target, components)
    const refObj = findRefObject(ref, components, targetName)

    applyToTarget(targetObj, refObj, path)
    messages.info(`Resolved ${ref} in ${targetName}`)
  }
} // resolveReferences

function findObject (ref, components) {
  const [ type, name ] = ref.split(':')
  const obj = components[type][name]

  return [ name, obj ]
} // findObject

function findRefObject (ref, components, targetName) {
  const [ , refObj ] = findObject(ref, components)

  if (!refObj) {
    throw new Error(`Could not resolve '${ref}' in ${targetName}`)
  }

  return refObj
} // findRefObject

function applyToTarget (targetObj, refObj, path) {
  const dottiePath = jp2dp(path)
  dottie.set(targetObj, dottiePath, refObj)
} // firstPassResolver

function jp2dp (targetPath) {
  return targetPath
    .replace('$.', '')
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
} // jp2dp

module.exports = firstPass
