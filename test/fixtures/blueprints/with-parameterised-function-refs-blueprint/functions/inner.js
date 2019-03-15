function innerFn (msg = 'I came from a function call') {
  return { message: msg }
}

module.exports = function () {
  return innerFn
}
