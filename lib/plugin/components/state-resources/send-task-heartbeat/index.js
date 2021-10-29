
class SendTaskHeartbeat {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
    this.relaxed = resourceConfig.relaxed
  }

  async run (event, context) {
    try {
      // console.log(`SendTaskHeartbeat ${JSON.stringify(event)}`)
      const validExecution = await this.statebox.describeExecution(event.executionName)
      if (!validExecution) {
        return this.invalidTarget(event, context)
      }

      const method = event.final ? 'sendTaskLastHeartbeat' : 'sendTaskHeartbeat'

      await this.statebox[method](
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
      error: 'sendTaskHeartbeat State Resource',
      cause: err
    })
  }
} // SendTaskHeartbeat

module.exports = SendTaskHeartbeat
