const moment = require('moment')

class SendTaskHeartbeat {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
    this.relaxed = resourceConfig.relaxed
    this.lastDescribedTimeFrame = resourceConfig.lastDescribedTimeFrame
  }

  async run (event, context) {
    try {
      const execution = event.executionName
        ? await this.statebox.describeExecution(event.executionName, false)
        : null

      if (!execution) {
        return this.invalidTarget(event, context)
      }

      if (execution.status !== 'RUNNING') {
        return this.notRunning(event, context)
      }

      if (!isNaN(this.lastDescribedTimeFrame) && execution.lastDescribed !== null) {
        // Is this parent execution still active?
        const buffer = 180
        const expected = moment().subtract(this.lastDescribedTimeFrame + buffer, 'seconds')
        const lastDescribed = moment(execution.lastDescribed)

        if (lastDescribed.isBefore(expected)) {
          await this.statebox.stopExecution(
            'Execution stopped interally',
            'STOPPED',
            event.executionName,
            {
              userId: context.userId,
              action: 'stopExecution',
              stateMachineName: event.executionName
            }
          )

          return this.notRunning(event, context)
        }
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
