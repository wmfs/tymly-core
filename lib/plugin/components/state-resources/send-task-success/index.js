
class SendTaskSuccess {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
  }

  async run (event, context) {
    try {
      const validExecution = await this.statebox.describeExecution(event.executionName)
      if (!validExecution) {
        return this.fail(
          context,
          new Error(`Referenced execution ${event.executionName} not found.`)
        )
      }

      await this.statebox.sendTaskSuccess(
        event.executionName,
        event.result,
        context.executionOptions
      )
      await context.sendTaskSuccess(event.result)
    } catch (err) {
      this.fail(context, err)
    }
  } // run

  fail (context, err) {
    context.sendTaskFailure({
      error: 'sendTaskSuccess State Resource',
      cause: err
    })
  }
} // SendTaskSuccess

module.exports = SendTaskSuccess
