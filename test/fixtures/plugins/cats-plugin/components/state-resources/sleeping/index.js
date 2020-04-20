'use strict'

module.exports = class Sleeping {
  run (event, context) {
    event.petDiary.push(`Sweet dreams ${event.petName}! x`)
    console.log('SLEEPING!!!!!!!!')
    context.sendTaskSuccess(event)
  }
}
