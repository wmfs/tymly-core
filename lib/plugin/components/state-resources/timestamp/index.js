
module.exports = class Timestamp {
  init (resourceConfig, env) {
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    let res = this.timestamp.now()

    if (event.query === '$TODAY') {
      res = this.timestamp.today()
    }

    if (event.query === '$YEAR') {
      res = this.timestamp.getYear()
    }

    return context.sendTaskSuccess(res)
  } // run
}
