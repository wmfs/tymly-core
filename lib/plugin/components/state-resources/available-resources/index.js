class AvailableResources {
  init (resourceConfig, env, callback) {
    this.statebox = env.bootedServices.statebox

    callback(null)
  } // init

  run (event, context) {
    const resources = this.statebox.listStateResources()
    context.sendTaskSuccess(resources)
  } // run
} // class AvailableResources

module.exports = AvailableResources
