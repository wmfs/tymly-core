class TestService {
  boot (options) {
    const { logger } = options.bootedServices
    logger.trace('This is a trace message')
    logger.debug('This is a debug message')
    logger.info('This is a info message')
    logger.warn('This is a warn message')
    logger.error('This is a error message')
    logger.fatal('This is a fatal message')
  }
}

module.exports = {
  serviceClass: TestService
}
