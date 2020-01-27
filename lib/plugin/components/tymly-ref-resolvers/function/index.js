function canResolve (refs) {
  return refs.length >= 2 &&
    refs[0] === 'function'
} // canResolve

function resolver (refParts, services) {
  const [, funcName, ...args] = refParts
  const fn = services.functions.functions[funcName]

  return fn ? fn.func(...args) : null
} // resolver

module.exports = {
  canResolve,
  resolver
}
