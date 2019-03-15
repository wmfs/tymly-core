function innerFn () {
  return { message: 'I came from a function call' }
}

module.exports = function () {
  return innerFn
}
