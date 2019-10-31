const cloneDeep = require('lodash').cloneDeep

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

    const launchedEvent = cloneDeep(event)
    launchedEvent.launcher = {
      executionName: context.executionName
    }

    const launchedExecDesc = await this.statebox.startExecution(
      launchedEvent,
      this.stateMachine,
      {
        sendResponse: 'IMMEDIATELY',
        userId: context.userId
      }
    )

    return context.sendTaskSuccess({
      executionName: launchedExecDesc.executionName,
      status: launchedExecDesc.status,
      startDate: launchedExecDesc.startDate
    })
  }
}

module.exports = LaunchStateMachine
