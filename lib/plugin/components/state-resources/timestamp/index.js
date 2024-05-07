
module.exports = class Timestamp {
  init (resourceConfig, env) {
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    console.log('EVENT: ', event)
    let res = this.timestamp.now()

    if (event.query === '$TODAY') {
      console.log('today')
      res = this.timestamp.today()
    }

    if (event.query === '$YEAR') {
      console.log('year')
      res = this.timestamp.getYear()
    }

    return context.sendTaskSuccess(res)
  } // run
}
