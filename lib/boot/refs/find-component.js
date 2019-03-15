function findComponent (ref, components) {
  const [ type, name ] = ref.split(':')
  const obj = components[type][name]

  return [ name, obj ]
} // findObject

module.exports = findComponent
