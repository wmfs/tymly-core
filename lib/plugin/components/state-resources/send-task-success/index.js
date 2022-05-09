
class SendTaskSuccess {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
    this.relaxed = resourceConfig.relaxed
  }

  async run (event, context) {
    try {
      const execution = event.executionName
        ? await this.statebox.describeExecution(event.executionName, false)
        : null

      if (!execution) {
        return this.invalidTarget(event, context)
      }

      await this.statebox.sendTaskSuccess(
        event.executionName,
        event.result,
        context.executionOptions
      )

      context.sendTaskSuccess()
    } catch (err) {
      this.fail(context, err)
    }
  } // run

  invalidTarget (event, context) {
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
