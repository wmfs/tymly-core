'use strict'

module.exports = class WakingUp {
  run (event, context) {
    event.petDiary.push(`Look out, ${event.petName} is waking up!`)
    context.sendTaskSuccess(event)
  }
}
