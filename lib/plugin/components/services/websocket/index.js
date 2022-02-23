const schema = require('./schema.json')
const ws = require('ws')

class WebsocketService {
  boot (options) {
    this.wss = new ws.Server({
      port: 8081 // todo: via env process.env.TYMLY_WS_PORT
    })

    this.clients = new Set()

    this.wss.on('connection', (ws, req) => this.onConnection(ws, req))
    this.wss.on('error', err => this.onError(err))
  }

  async onConnection (ws, req) {
    this.clients.add(ws)

    console.log(`Added client, total client(s): ${this.clients.size}`)

    ws.on('close', async code => {
      this.clients.delete(ws)

      console.log(`Connection closed (${code}), total client(s): ${this.clients.size}`)
    })

    ws.on('message', msg => console.log(`ws message: ${msg}`))
    ws.on('error', err => { console.log('connection error', err) }) // ignore if ECONNRESET
  }

  onError (err) {
    console.log('ERROR', err)
  }

  broadcast (payload) {
    for (const client of this.clients) {
      if (client.readyState !== 1) continue

      // todo: check key so only send to relevant clients
      client.send(typeof payload === 'string' ? payload : JSON.stringify(payload))
    }
  }

  shutdown () {
    if (this.wss) return this.wss.close()
  }
}

module.exports = {
  schema,
  serviceClass: WebsocketService
}
