'use strict'

module.exports = class Hello {
  run (event, context) {
    const greeting = 'HELLO, I SHOULD NOT BE...'
    console.log(greeting)
    event.greeting = greeting
    context.sendTaskSuccess()
  }
}
