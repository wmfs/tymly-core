const schema = require('./schema.json')
const ws = require('ws')

class WebsocketService {
  boot (options) {
    this.subscriptionService = options.bootedServices.subscriptions

    this.wss = new ws.Server({
      port: 8081 // todo: via env
    })

    this.clients = new Set()

    this.wss.on('connection', (ws, req) => this.onConnection(ws, req))
    this.wss.on('error', err => this.onError(err))
  }

  findSubscriptionsFromQueryString (queryString) {
    const searchParams = new URLSearchParams(queryString.slice(1))
    const subscriptions = JSON.parse(searchParams.get('subscriptions'))

    // todo: are they valid subscriptions?

    return subscriptions
  }

  async onConnection (ws, req) {
    ws.subscriptions = this.findSubscriptionsFromQueryString(req.url)

    await this.subscriptionService.subscribe(ws.subscriptions)
    this.clients.add(ws)

    console.log(`Added client, total client(s): ${this.clients.size}`)

    ws.on('close', async code => {
      await this.subscriptionService.unsubscribe(ws.subscriptions)
      this.clients.delete(ws)

      console.log(`Connection closed (${code}), total client(s): ${this.clients.size}`)
    })

    ws.on('message', msg => console.log(`ws message: ${msg}`))
    ws.on('error', err => { console.log('connection error', err) }) // ignore if ECONNRESET
  }

  onError (err) {
    console.log('ERROR', err)
  }

  send ({ key, payload }) {
    for (const client of this.clients) {
      client.send(JSON.stringify({ key, payload }))
    }
  }

  shutdown () {
    if (this.wss) return this.wss.close()
  }
}

module.exports = {
  schema,
  serviceClass: WebsocketService,
  bootAfter: ['subscriptions']
}
