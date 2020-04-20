
class Heartbeat {
  async run (event, context, done) {
    const heartbeat = {
      heart: 'ba-dum-dum'
    }

    const executionDescription = await context.sendTaskHeartbeat(
      { heartbeat }
    )

    done(executionDescription)
  } // run
} // Heartbeat

module.exports = Heartbeat
