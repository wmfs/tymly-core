class AvailableStateMachines {
  init (resourceConfig, env, callback) {
    this.statebox = env.bootedServices.statebox

    callback(null)
  } // init

  run (event, context) {
    const stateMachines = this.statebox.listStateMachines()

    context.sendTaskSuccess(stateMachines)
  } // run
} // class AvailableStateMachines

module.exports = AvailableStateMachines
