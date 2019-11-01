
class SendTaskSuccess {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
  }

  run (event, context) {
    this.statebox.sendTaskSuccess(
      event.executionName,
      event.result,
      context.executionOptions
    )
    context.sendTaskSuccess(event.result)
  } // run
} // SendTaskSuccess

module.exports = SendTaskSuccess
