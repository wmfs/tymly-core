module.exports = class Timestamp {
  init (resourceConfig, env) {
    this.query = resourceConfig.query
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    if (this.query === '$TODAY') {
      return context.sendTaskSuccess(this.timestamp.today())
    }

    if (this.query === '$YEAR') {
      return context.sendTaskSuccess(this.timestamp.getYear())
    }

    return context.sendTaskSuccess(this.timestamp.now())
  } // run
}
