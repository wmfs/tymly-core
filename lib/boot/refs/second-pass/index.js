const findComponent = require('../find-component')
const applyToTarget = require('../apply-to-target')

const resolvers = [
  require('./resolver/functions')
]

function secondPass (
  loadedComponents,
  bootedServices,
  messages
) {
  messages.heading('Reference resolution - second pass')

  const components = loadedComponents.blueprintComponents
  const tymlyRefs = loadedComponents.blueprintRefs

  const resolutions = findSecondPassResolutions(tymlyRefs)

  if (!resolutions) {
    messages.subHeading('Nothing to resolve')
    return
  }

  resolveResolutions(
    resolutions,
    components,
    bootedServices,
    messages
  )
} // secondPass

function findSecondPassResolutions (tymlyRefs) {
  const secondPass = [ ]

  for (const [type, referees] of Object.entries(tymlyRefs)) {
    for (const [targetName, references] of Object.entries(referees)) {
      const target = `${type}:${targetName}`

      const refs = references
        .filter(ref => !ref.when)
        .map(ref => {
          ref.resolver = findResolver(ref.ref)
          return ref
        })
        .filter(ref => ref.resolver)

      refs.forEach(r =>
        secondPass.push({
          target: target,
          path: r.path,
          ref: r.ref,
          resolver: r.resolver
        })
      )

      refs.forEach(r => { r.when = 'secondPass' })
    } // refs ...
  } // for ...

  return secondPass.length ? secondPass : null
} // findSecondPassResolutions

function findResolver (reference) {
  const refParts = reference.split(':')

  for (const resolver of resolvers) {
    if (resolver.canResolve(refParts)) {
      return resolver.resolver
    }
  }

  return null
} // canResolve

function resolveResolutions (
  toResolve,
  components,
  bootedServices,
  messages
) {
  for (const { target, path, ref, resolver } of toResolve) {
    const [ targetName, targetObj ] = findComponent(target, components)

    const refObj = resolveResolution(
      ref,
      resolver,
      bootedServices
    )

    if (!refObj) {
      throw new Error(`Could not resolve ${ref} in ${target}`)
    }

    applyToTarget(targetObj, refObj, path)
    messages.info(`Resolved ${ref} in ${targetName}`)
  }
} // resolveResolutions

function resolveResolution(
  ref,
  resolver,
  bootedServices
) {
  const refParts = ref.split(':')
  return resolver(refParts, bootedServices)
}

module.exports = secondPass
