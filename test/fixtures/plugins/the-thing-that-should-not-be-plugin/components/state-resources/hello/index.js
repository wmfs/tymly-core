'use strict'

module.exports = class Hello {
  init (resourceConfig, env, callback) {
    callback(null)
  }

  run (event, context) {
    const greeting = 'HELLO, I SHOULD NOT BE...'
    console.log(greeting)
    event.greeting = greeting
    context.sendTaskSuccess()
  }
}
