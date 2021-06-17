const debug = require('debug')('websocket-server')
const WebSocket = require('ws')

class WebsocketServerService {
  boot (options) {
    this.webSocketServer = new WebSocket.Server({
      port: 8081 // process.env.TYMLY_WEBSOCKET_PORT
      // todo more config?
    })

    this.clients = []

    this.webSocketServer.on('connection', ws => {
      console.log('WebsocketServerService - connection made')

      this.clients.push(ws)

      this.webSocketServer.on('error', err => {
        console.log(err.stack)
      })
    })
  }

  broadcast (payload) {
    for (const ws of this.clients) {
      if (ws.readyState === 1) {
        ws.send(payload)
      }
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