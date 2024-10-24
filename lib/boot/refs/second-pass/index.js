const findComponent = require('../find-component')
const applyToTarget = require('../apply-to-target')

async function secondPass (
  loadedComponents,
  bootedServices,
  messages
) {
  messages.heading('Reference resolution - second pass')

  const resolvers = findResolvers(
    loadedComponents.pluginComponents,
    messages
  )

  if (!resolvers) return

  const components = loadedComponents.blueprintComponents
  const tymlyRefs = loadedComponents.blueprintRefs

  const resolutions = findSecondPassResolutions(
    tymlyRefs,
    resolvers
  )

  if (!resolutions) {
    messages.subHeading('Nothing to resolve')
    return
  }

  await resolveResolutions(
    resolutions,
    components,
    bootedServices,
    messages
  )
} // secondPass

function findResolvers (pluginComponents, messages) {
  const refResolvers = pluginComponents && pluginComponents.tymlyRefResolvers
  if (!refResolvers) {
    return
  }

  messages.subHeading('Loading tymlyRefResolvers')
  const found = []
  for (const [refId, resolver] of Object.entries(refResolvers)) {
    const module = resolver.componentModule
    if (isResolver(module)) {
      messages.info(`Found ${refId}`)
      found.push(module)
    }
  }

  return found.length ? found : null
} // findResolvers

function isResolver (module) {
  return isFunction(module.canResolve) &&
    isFunction(module.resolver)
} // isResolver

function isFunction (candidate) {
  return typeof candidate === 'function'
} // isFunction

function findSecondPassResolutions (
  tymlyRefs,
  resolvers
) {
  const secondPass = []

  for (const [type, referees] of Object.entries(tymlyRefs)) {
    for (const [targetName, references] of Object.entries(referees)) {
      const target = `${type}:${targetName}`

      const refs = references
        .filter(ref => !ref.when)
        .map(ref => {
          ref.resolver = findResolver(ref.ref, resolvers)
          return ref
        })
        .filter(ref => ref.resolver)

      refs.forEach(r =>
        secondPass.push({
          target,
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

function findResolver (reference, resolvers) {
  const refParts = reference.split(':')

  for (const resolver of resolvers) {
    if (resolver.canResolve(refParts)) {
      return resolver.resolver
    }
  }

  return null
} // canResolve

async function resolveResolutions (
  toResolve,
  components,
  bootedServices,
  messages
) {
  messages.subHeading('Resolving tymlyRefs')
  for (const { target, path, ref, resolver } of toResolve) {
    const [targetName, targetObj] = findComponent(target, components)

    const refObj = await resolveResolution(
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

function resolveResolution (
  ref,
  resolver,
  bootedServices
) {
  const refParts = ref.split(':')
  return resolver(refParts, bootedServices)
}

module.exports = secondPass
