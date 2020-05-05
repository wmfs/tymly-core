'use strict'

class TestService2 {
  boot (options) {
    this.testService3 = options.bootedServices.testService3
    this.testService3.bootOrder.push('testService2')
  }

  async shutdown () {
    this.testService3.shutdownOrder.push('testService2')
  }
}

module.exports = {
  serviceClass: TestService2,
  bootAfter: ['testService1']
}
