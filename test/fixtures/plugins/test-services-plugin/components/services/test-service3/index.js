'use strict'

class TestService3 {
  boot (options, callback) {
    this.bootOrder = ['testService3']
    this.shutdownOrder = []
    callback(null)
  }

  async shutdown () {
    this.shutdownOrder.push('testService3')
  }
}

module.exports = {
  serviceClass: TestService3,
  bootBefore: ['testService1', 'statebox'],
  bootAfter: ['inventory']
}
