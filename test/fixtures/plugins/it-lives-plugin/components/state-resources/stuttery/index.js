'use strict'

let fail = false

module.exports = class Stuttery {
  run (event, context) {
    fail = !fail
    if (fail) {
      console.log('Stuttery - NO')
      context.sendTaskFailure(
        {
          error: 'SomethingBadHappened',
          cause: 'But at least it was expected'
        }
      )
    } else {
      console.log('Stuttery - YES')
      context.sendTaskSuccess({})
    }
  }
}
