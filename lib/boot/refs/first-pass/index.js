const findComponent = require('../find-component')
const applyToTarget = require('../apply-to-target')

// First pass through the references. None of the services
// have yet been booted, but we can resolve static references
function firstPass (loadedComponents, messages) {
  messages.heading('Reference resolution - first pass')

  const components = loadedComponents.blueprintComponents
  const tymlyRefs = loadedComponents.blueprintRefs

  const resolutions = findFirstPassResolutions(tymlyRefs, components)

  if (!resolutions) {
    messages.subHeading('Nothing to resolve')
    return
  }

  resolveResolutions(resolutions, components, messages)
} // firstPass

function findFirstPassResolutions (tymlyRefs, components) {
  const firstPass = []
  const roots = new Set()

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

      firstPassRefs.forEach(r => { r.when = 'firstPass' })

      roots.add(target)
    } // refs
  } // for ...

  checkRootsForLoops(roots, firstPass)

  return firstPass.length ? firstPass : null
} // firstPassReferences

function canResolve (reference, components) {
  const refParts = findParts(reference)
  return components[refParts[0]] &&
    ((refParts.length === 2) || (refParts.length === 3))
} // canResolve

function findParts (reference) {
  const parts = reference.split(':')

  if (
    (parts.length >= 3) &&
    (parts[2].startsWith('$.'))
  ) { // JSON path selector on the ref
    return [
      parts[0],
      parts[1],
      parts.slice(2).join('')
    ]
  }

  return parts
}

function checkRootsForLoops (roots, firstPassRefs) {
  for (const root of roots) {
    checkForLoop(root, firstPassRefs, [root])
  }
} // checkForLoops

function checkForLoop (target, firstPassRefs, step) {
  const deps = findDependencies(target, firstPassRefs)

  const root = step[0]
  if (deps.has(root)) {
    throw new Error(`Circular dependency in ${root}: ${step.join('->')}`)
  }

  for (const dep of deps) {
    checkForLoop(dep, firstPassRefs, [...step, dep])
  }
} // checkForLoop

function findDependencies (target, resolutions) {
  const deps = resolutions.filter(
    resolution => resolution.target === target
  ).map(
    resolution => resolution.ref
  )
  return new Set(deps)
} // findTransitive

function resolveResolutions (toResolve, components, messages) {
  messages.subHeading('Resolving tymlyRefs')
  for (const { target, path, ref } of toResolve) {
    const [targetName, targetObj] = findComponent(target, components)
    const refObj = findRefObject(ref, components, targetName)

    if (!refObj) {
      throw new Error(`Could not resolve ${ref} in ${target}`)
    }

    applyToTarget(targetObj, refObj, path)
    messages.info(`Resolved ${ref} in ${targetName}`)
  }
} // resolveResolutions

function findRefObject (ref, components) {
  const [typeAndName, jsonSelector] = typeNamePath(ref)

  const [, refObj] = findComponent(
    typeAndName,
    components,
    jsonSelector
  )

  if (!refObj) {
    return findRefObjectsByWildcard(typeAndName, components)
  }

  return refObj
} // findRefObject

function typeNamePath (ref) {
  const typeDelim = ref.indexOf(':')
  const nameDelim = ref.indexOf(':', typeDelim + 1)

  if (nameDelim === -1) {
    return [ref, null]
  }

  return [
    ref.substring(0, nameDelim),
    ref.substring(nameDelim + 1)
  ]
} // typeNamePath

function findRefObjectsByWildcard (ref, components) {
  if (isNamespaceWildcard(ref)) {
    return findRefObjectsByWildcardNamespace(ref, components)
  }

  if (isNameWildcard(ref)) {
    return findRefObjectsByWildcardName(ref, components)
  }

  return null
} // findRefObjectsByWildcard

function isNamespaceWildcard (ref) {
  return ref.endsWith(':*')
} // isNamespaceWildcard

function findRefObjectsByWildcardNamespace (ref, components) {
  const [type] = ref.split(':')

  const objects = components[type]
  return objects ? Object.values(objects) : null
} // findRefObjectsByWildcardNamespace

function isNameWildcard (ref) {
  return ref.endsWith('_*')
} // isNameWildcard

function findRefObjectsByWildcardName (ref, components) {
  const [type, qualifiedName] = ref.split(':')
  const [namespace] = qualifiedName.split('_')

  const objects = components[type]
  return objects
    ? Object.values(objects).filter(o => o.namespace === namespace)
    : null
} // findRefObjectsByWildcardNamespace

module.exports = firstPass
