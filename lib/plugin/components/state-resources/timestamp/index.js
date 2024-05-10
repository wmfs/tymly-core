
module.exports = class Timestamp {
  init (resourceConfig, env) {
    this.query = resourceConfig.query
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    let res = this.timestamp.now()

    if (this.query === '$TODAY') {
      res = this.timestamp.today()
    }

    if (this.query === '$YEAR') {
      res = this.timestamp.getYear()
    }

    return context.sendTaskSuccess(res)
  } // run
}
