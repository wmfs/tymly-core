class AvailableStateMachines {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
  } // init

  run (event, context) {
    const stateMachines = this.statebox.listStateMachines()
    context.sendTaskSuccess(stateMachines)
  } // run
} // class AvailableStateMachines

module.exports = AvailableStateMachines
