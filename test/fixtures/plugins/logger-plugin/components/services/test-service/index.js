class TestService {
  boot (options) {
    const logger1 = options.bootedServices.logger.addLogger('test-service')

    logger1.trace('This is a trace message')
    logger1.debug('This is a debug message')

    const logger2 = options.bootedServices.logger.addLogger('testing')

    logger2.info('This is an info message')
    logger2.warn('This is a warn message')

    const logger3 = options.bootedServices.logger.addLogger()

    logger3.error('This is an error message')
    logger3.fatal('This is a fatal message')
  }
}

module.exports = {
  serviceClass: TestService
}
