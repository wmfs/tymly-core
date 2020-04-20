
module.exports = class Timestamp {
  init (resourceConfig, env) {
    this.timestamp = env.bootedServices.timestamp
  }

  run (event, context) {
    context.sendTaskSuccess(this.timestamp.now())
  } // run
} // GetRegistryKey
