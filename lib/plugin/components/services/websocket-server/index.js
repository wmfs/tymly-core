const debug = require('debug')('websocket-server')
const WebSocket = require('ws')

class WebsocketServerService {
  boot (options) {
    this.webSocketServer = new WebSocket.Server({
      port: 8081 // process.env.TYMLY_WEBSOCKET_PORT
      // todo more config?
    })

    this.clients = []

    this.webSocketServer.on('connection', (ws, req) => {
      ws.on('error', err => {
        debug('connection error', err)
        // todo: ignore if ECONNRESET
        // todo: remove from clients?
      })

      ws.on('close', (code, reason) => {
        debug('connection close', code, reason)
        // todo: remove from clients?
      })

      this.clients = this.clients.filter(({ ws }) => ![2, 3].includes(ws.readyState))
      this.clients.push({ ws })

      debug(`connection (${this.clients.length} connections)`)
      // todo: kill older connections once so many stored?

      // const key = getKeyFromUrl(req.url)
      // todo: store key with client
    })

    this.webSocketServer.on('error', err => {
      debug('server error', err)
    })
  }

  broadcast (payload) {
    debug('broadcast', payload)
    for (const { ws } of this.clients) {
      // todo: check key so only send to relevant clients
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

// function getKeyFromUrl (url) {
//   const params = {}
//   // todo: do this better as there might not be anything passed in
//   req.url
//     .split('?')[1]
//     .split('&')
//     .forEach(r => {
//       const [key, value] = r.split('=')
//       params[key] = value
//     })
//   const key = params || '$ALL'
// }

module.exports = {
  schema: require('./schema.json'),
  serviceClass: WebsocketServerService
}