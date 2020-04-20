'use strict'

module.exports = class Eating {
  run (event, context) {
    console.log('EATING!!!!', context.executionName)
    event.petDiary.push(`Shh, ${event.petName} is eating...`)
    event.hoursSinceLastMeal = 0
    context.sendTaskSuccess(event)
  }
}
