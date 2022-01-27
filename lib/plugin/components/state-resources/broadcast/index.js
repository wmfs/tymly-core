class Broadcast {
  init (resourceConfig, env) {
    this.key = resourceConfig.key
    this.services = env.bootedServices
  }

  async run (event, context) {
    // todo: resolve input paths if necessary
    this.services.websocket.send({ key: `${this.key}`, payload: event })
    context.sendTaskSuccess()
  } // run
} // class Broadcast

module.exports = Broadcast
