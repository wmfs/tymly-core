const COMPLETE = 'COMPLETE'
const FAILED = 'FAILED'
const SUCCEEDED = 'SUCCEEDED'

class RunStateMachine {
  init (stateConfig, options) {
    this.statebox = options.bootedServices.statebox
    this.stateMachine = stateConfig.stateMachine
  } // init

  async run (event, context, done) {
    const exists = this.statebox.findStateMachineByName(this.stateMachine)
    if (!exists) {
      return context.sendTaskFailure({
        error: 'runStateMachine',
        cause: new Error(`Reference state machine ${this.stateMachine}`)
      })
    }

    const responseName = desiredResponse(context)
    const execDesc = await this.statebox.startExecution(
      event,
      this.stateMachine,
      {
        sendResponse: responseName,
        userId: context.userId
      }
    )

    switch (execDesc.status) {
      case SUCCEEDED:
        return context.sendTaskSuccess(execDesc.ctx)
      case FAILED:
        return context.sendTaskFailure({
          error: execDesc.errorCode,
          cause: execDesc.errorMessage
        })
      default:
        if (responseName !== COMPLETE) {
          const executionDescription = await context.sendTaskHeartbeat(execDesc.ctx)
          executionDescription.currentResource = execDesc.currentResource
          done(executionDescription)
        }
    }
  } // run
} // class RunStateMachine

function desiredResponse (context) {
  const callback = context.task.callbackManager.callbacks[context.executionName]
  return callback ? callback.eventName : COMPLETE
} // desiredResponse

module.exports = RunStateMachine
