'use strict'

module.exports = class Hello {
  run (event, context) {
    console.log('I SHOULD NOT BE!!!')
    context.sendTaskSuccess()
  }
}
