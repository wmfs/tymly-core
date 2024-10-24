class Heartbeat {
  run (event, context) {
    const heartbeat = {
      heart: 'ba-dum-dum'
    }

    context.sendTaskHeartbeat(
      { heartbeat }
    )
  } // run
} // Heartbeat

module.exports = Heartbeat
