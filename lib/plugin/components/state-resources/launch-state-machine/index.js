const defaultsDeep = require('lodash').defaultsDeep

class LaunchStateMachine {
  init (stateConfig, options) {
    this.statebox = options.bootedServices.statebox
    this.stateMachine = stateConfig.stateMachine
  }

  async run (event, context) {
    const exists = this.statebox.findStateMachineByName(this.stateMachine)

    if (!exists) {
      return context.sendTaskFailure({
        error: 'launchStateMachine',
        cause: new Error(`Referenced state machine ${this.stateMachine} not found`)
      })
    }

    const parentExecutionName = context.executionName

    await this.statebox.describeExecution(parentExecutionName, { updateLastDescribed: true })

    const launcher = {
      executionName: parentExecutionName
    }

    const launchedEvent = defaultsDeep({ launcher }, event)

    try {
      const launchedExecDesc = await this.statebox.startExecution(
        launchedEvent,
        this.stateMachine,
        {
          sendResponse: 'IMMEDIATELY',
          userId: context.userId,
          parentExecutionName
        }
      )

      return context.sendTaskSuccess({
        executionName: launchedExecDesc.executionName,
        status: launchedExecDesc.status,
        startDate: launchedExecDesc.startDate
      })
    } catch (e) {
      return context.sendTaskFailure({
        error: 'launchStateMachine',
        cause: e
      })
    }
  }
}

module.exports = LaunchStateMachine
