const cloneDeep = require('lodash').cloneDeep

class AwaitingExternalInput {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
    this.continueAfter = resourceConfig.continueAfter
    this.failAfter = resourceConfig.failAfter
  }

  /**
   * Holds a statebox execution to allow an external process to have some input
   * e.g. some other long running task
   * */
  async run (event, context) {
    const executionDescription = await context.sendTaskHeartbeat()

    if (this.continueAfter) {
      this.timeoutAfter(executionDescription, 'sendTaskSuccess', this.continueAfter)
    } else if (this.failAfter) {
      this.timeoutAfter(executionDescription, 'sendTaskFailure', this.failAfter)
    }

    return executionDescription
  } // run

  timeoutAfter (executionDescription, methodName, timeoutSeconds) {
    const executionName = executionDescription.executionName
    const stateAtTimeoutStart = executionDescription.currentStateName
    const executionOptions = cloneDeep(executionDescription.executionOptions)
    executionOptions.sendResponse = 'IMMEDIATELY'
    const timeoutMs = timeoutSeconds * 1000

    setTimeout(
      () => this.timeoutExpired(
        executionName,
        stateAtTimeoutStart,
        methodName,
        executionOptions
      ),
      timeoutMs)
  } // timeoutAfter

  async timeoutExpired (
    executionName,
    stateAtTimeoutStart,
    methodName,
    executionOptions
  ) {
    const currentExecutionDescription = await this.statebox.describeExecution(executionName)
    if (
      (currentExecutionDescription.currentStateName !== stateAtTimeoutStart) ||
      (currentExecutionDescription.status !== 'RUNNING')
    ) {
      return // things have moved on, so do nothing
    }

    this.statebox[methodName](executionName, 'time-out', executionOptions)
  } // timeoutExpired
} // class AwaitingExternalInput

module.exports = AwaitingExternalInput
