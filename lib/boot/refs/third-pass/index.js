
function thirdPass (
  loadedComponents,
  messages
) {
  const tymlyRefs = loadedComponents.blueprintRefs

  const resolutions = findUnresolvedResolutions(tymlyRefs)

  const errorMsg = resolutions.map(r =>
    `Unknown tymlyRef ${r.ref} in ${r.target}`
  ).join('\n')

  if (errorMsg) throw new Error(errorMsg)
} // thirdPass

function findUnresolvedResolutions (tymlyRefs) {
  const unresolved = [ ]

  for (const [type, referees] of Object.entries(tymlyRefs)) {
    for (const [targetName, references] of Object.entries(referees)) {
      const target = `${type}:${targetName}`

      references
        .filter(ref => !ref.when)
        .forEach(r => unresolved.push({
          target: target,
          ref: r.ref
        }))
    } // refs ...
  } // for ...

  return unresolved
} // findUnresolved

module.exports = thirdPass
