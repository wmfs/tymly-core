'use strict'

class TestService1 {
  boot (options) {
    this.testService3 = options.bootedServices.testService3
    this.testService3.bootOrder.push('testService1')
  }

  async shutdown () {
    this.testService3.shutdownOrder.push('testService1')
  }
}

module.exports = {
  serviceClass: TestService1
}
