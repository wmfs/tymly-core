const moment = require('moment')
const schema = require('./schema.json')

class TimestampService {
  static get defaultProvider () {
    return {
      now () {
        return moment()
      },
      today () {
        return moment().hour(0).minute(0).second(0).millisecond(0)
      },
      getYear () {
        return moment().format('yyyy')
      },
      format (value, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(value).format(format)
      }
    }
  } // defaultProvider

  boot () {
    this.timeProvider = TimestampService.defaultProvider
  }

  now () {
    return this.timeProvider.now()
  }

  today () {
    return this.timeProvider.today()
  }

  getYear () {
    return this.timeProvider.getYear()
  }

  format (value, format) {
    return this.timeProvider.format(value, format)
  }
} // class TimestampService

module.exports = {
  serviceClass: TimestampService,
  schema,
  bootBefore: ['statebox']
}
