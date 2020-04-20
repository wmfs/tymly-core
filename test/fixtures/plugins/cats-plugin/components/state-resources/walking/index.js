'use strict'

module.exports = class Walking {
  run (event, context) {
    console.log('WALKING....')
    event.petDiary.push(`${event.petName} is walking... where's ${event.gender === 'male' ? 'he' : 'she'} off to?`)
    context.sendTaskSuccess(event)
  }
}
