const { isObject } = require('lodash')

module.exports = function searchForRefs (json, jsonPath, refs) {
  if (!isObject(json)) return

  const reference = json.$tymlyRef
  if (reference) {
    verifyTymlyRefObject(json, jsonPath)

    refs.push({
      path: jsonPath,
      ref: reference
    })

    return refs
  } // if ...

  // nothing found, continue down the tree
  if (Array.isArray(json)) {
    json.forEach((sub, index) =>
      searchForRefs(sub, `${jsonPath}[${index}]`, refs)
    )
  } else if (isObject(json)) {
    Object.entries(json).forEach(([name, sub]) =>
      searchForRefs(sub, `${jsonPath}.${name}`, refs)
    )
  }

  return refs
} // searchForRefs

function verifyTymlyRefObject (ref, jsonPath) {
  // tymlyRefs must look like
  // { "$tymlyRef": "some reference path" }

  if (Object.keys(ref).length !== 1) {
    throw new Error(`Malformed tymlyRef at ${jsonPath}`)
  }
} // verifyTymlyRefObject
