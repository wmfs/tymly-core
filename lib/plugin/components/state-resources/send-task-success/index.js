
class SendTaskSuccess {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
    this.relaxed = resourceConfig.relaxed
  }

  async run (event, context) {
    try {
      const validExecution = await this.statebox.describeExecution(event.executionName)
      if (!validExecution) {
        return this.invalidTarget(event, context)
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

  invalidTarget(event, context) {
    if (this.relaxed) {
      return context.sendTaskSuccess(event.result)
    }

    this.fail(
      context,
      new Error(`Referenced execution ${event.executionName} not found.`)
    )
  } // invalidTarget

  fail (context, err) {
    context.sendTaskFailure({
      error: 'sendTaskSuccess State Resource',
      cause: err
    })
  }
} // SendTaskSuccess

module.exports = SendTaskSuccess
