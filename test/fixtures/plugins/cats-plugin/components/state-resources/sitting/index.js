'use strict'

module.exports = class Walking {
  run (event, context) {
    console.log('SITTING!!!!', context.executionName)
    event.petDiary.push(`${event.petName} is sitting.`)
    context.sendTaskSuccess(event)
  }
}
