module.exports = class TimestampFormat {
  init (resourceConfig, env) {
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    return context.sendTaskSuccess(
      this.timestamp.format(event.timestamp, event.format)
    )
  }
}
