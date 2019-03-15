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
  const firstPass = [ ]
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
  const refParts = reference.split(':')
  return (refParts.length === 2) && (components[refParts[0]])
} // canResolve

function checkRootsForLoops (roots, firstPassRefs) {
  for (const root of roots) {
    checkForLoop(root, firstPassRefs, [ root ])
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
    const [ targetName, targetObj ] = findComponent(target, components)
    const refObj = findRefObject(ref, components, targetName)

    if (!refObj) {
      throw new Error(`Could not resolve ${ref} in ${target}`)
    }

    applyToTarget(targetObj, refObj, path)
    messages.info(`Resolved ${ref} in ${targetName}`)
  }
} // resolveResolutions

function findRefObject (ref, components) {
  const [ , refObj ] = findComponent(ref, components)
  return refObj
} // findRefObject

module.exports = firstPass
