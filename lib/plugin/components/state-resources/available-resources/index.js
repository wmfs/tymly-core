class AvailableResources {
  init (resourceConfig, env) {
    this.statebox = env.bootedServices.statebox
  } // init

  run (event, context) {
    const resources = this.statebox.listStateResources()
    context.sendTaskSuccess(resources)
  } // run
} // class AvailableResources

module.exports = AvailableResources
