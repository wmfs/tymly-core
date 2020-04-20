'use strict'

module.exports = class Hello {
  run (event, context) {
    const greeting = 'HELLO...'
    console.log(greeting)
    event.greeting = greeting
    context.sendTaskSuccess()
  }
}
