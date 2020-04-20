'use strict'

module.exports = class Hello {
  run (event, context) {
    console.log('I LIVE!!!')
    context.sendTaskSuccess()
  }
}
