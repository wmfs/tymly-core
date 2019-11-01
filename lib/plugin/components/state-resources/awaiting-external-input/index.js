class AwaitingExternalInput {
  init (resourceConfig) {
  }

  /**
   * Holds a statebox execution to allow an external process to have some input
   * e.g. some other long running task
   * */
  async run (event, context, done) {
    const executionDescription = await context.sendTaskHeartbeat()
    done(executionDescription)
  } // run
} // class AwaitingExternalInput

module.exports = AwaitingExternalInput
