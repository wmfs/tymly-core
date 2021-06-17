const debug = require('debug')('websocket-server')
const WebSocket = require('ws')

class WebsocketServerService {
  boot (options) {
    this.webSocketServer = new WebSocket.Server({
      port: 8081 // process.env.TYMLY_WEBSOCKET_PORT
      // todo more config?
    })

    this.ws = null

    this.webSocketServer.on('connection', ws => {
      debug('Connection made')
      this.ws = ws

      this.webSocketServer.on('error', err => {
        console.log(err.stack)
      })
    })
  }

  send (payload) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(payload)
    }
  }

  async shutdown () {
    debug('Shutting down...')
    try {
      await this.webSocketServer.close()
    } catch (e) {
      console.log('Error shutting down websocket-server', e)
    }
  }
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: WebsocketServerService
}