const dottie = require('dottie')
const debug = require('debug')('rbac')

function checkRoleAuthorization (userId, ownerId, roles, resourceType, resourceName, action, rbac) {
  const requiredRoleList = getRequiredRoleList(resourceType, resourceName, action, rbac.index)
  const result = checker(userId, ownerId, roles, requiredRoleList)
  addDebug(userId, roles, resourceType, resourceName, action, requiredRoleList, result)
  return result
} // checkRoleAuthorization

function getRequiredRoleList (resourceType, resourceName, action, rbacIndex) {
  // What roles will allow this?
  const unrestricted = dottie.get(rbacIndex, '*.*.*') || []
  const unrestrictedInADomain = dottie.get(rbacIndex, `${resourceType}.*.*`) || []
  const anyActionOnASpecificResource = dottie.get(rbacIndex, `${resourceType}.${resourceName}.*`) || []
  const anyDomainResourceForASpecificAction = dottie.get(rbacIndex, `${resourceType}.*.${action}`) || []
  const specific = dottie.get(rbacIndex, `${resourceType}.${resourceName}.${action}`) || []

  return unrestricted.concat(
    unrestrictedInADomain,
    anyActionOnASpecificResource,
    anyDomainResourceForASpecificAction,
    specific
  )
} // getRequiredRoleList

function checker (uid, ownerId, roles, requiredRoleList) {
  if (requiredRoleList.length === 0) {
    return false
  }

  if (requiredRoleList.includes('$everyone')) {
    return true
  }

  if (uid && requiredRoleList.includes('$authenticated')) {
    return true
  }

  for (const role of roles) {
    if (requiredRoleList.includes(role)) return true
  }

  // TODO: $owner is actually a finer-grained restriction over usual roles. Not this.
  return requiredRoleList.includes('$owner') &&
    uid &&
    (ownerId === uid)
} // checker

function addDebug (uid, roles, resourceType, resourceName, action, requiredRoleList, result) {
  const text = `User '${uid}' is attempting to '${action}' on ${resourceType} '${resourceName}'... ` +
    `\n\twhich requires one of these roles: ${JSON.stringify(requiredRoleList)},` +
    `\n\tand user has these roles: ${JSON.stringify(roles)}. \n\t` +
    (result ? 'Access permitted!' : 'Access denied!')
  debug(text)
} // addDebug

module.exports = checkRoleAuthorization
