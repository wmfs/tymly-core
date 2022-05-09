
class SendTaskHeartbeat {
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

      if (validExecution.status !== 'RUNNING') {
        return this.notRunning(event, context)
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

  notRunning (event, context) {
    if (this.relaxed) {
      return context.sendTaskSuccess(event.result)
    }

    this.fail(
      context,
      new Error(`Referenced execution ${event.executionName} is no longer running.`)
    )
  } // notRunning

  fail (context, err) {
    context.sendTaskFailure({
      error: 'sendTaskHeartbeat State Resource',
      cause: err
    })
  } // fail
} // SendTaskHeartbeat

module.exports = SendTaskHeartbeat
