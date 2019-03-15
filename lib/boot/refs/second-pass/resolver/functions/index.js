function canResolve (refs) {
  return refs.length === 2 &&
    refs[0] === 'function'
}

function resolver (refParts, services) {
  const funcName = refParts[1]
  const fn = services.functions.functions[funcName]

  return fn ? fn.func() : null
} // resolver

module.exports = {
  canResolve,
  resolver
}
