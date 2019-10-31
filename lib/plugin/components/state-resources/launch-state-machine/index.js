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

    const execDesc = await this.statebox.startExecution(
      event,
      this.stateMachine,
      {
        sendResponse: 'IMMEDIATELY',
        userId: context.userId
      }
    )

    return context.sendTaskSuccess(execDesc)
  }
}

module.exports = LaunchStateMachine
