'use strict'

module.exports = function normalFunction () {
  return function normalFunction (event, context) {
    return { name: event.options.name, userId: context.userId }
  }
}
