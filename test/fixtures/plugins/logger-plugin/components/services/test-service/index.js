class TestService {
  boot (options) {
    const logger = options.bootedServices.logger // .child({ key: 'test-service' })

    logger.trace('This is a trace message')
    logger.debug('This is a debug message')
    logger.info('This is an info message')
    logger.warn('This is a warn message')
    logger.error('This', 'is an', 'error message')
    logger.fatal('This is a fatal message', '!!!')
  }
}

module.exports = {
  serviceClass: TestService
}
