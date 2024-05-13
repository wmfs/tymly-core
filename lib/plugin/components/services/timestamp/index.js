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
      getYear (dateInput = new Date()) {
        return moment().format('yyyy')
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
} // class TimestampService

module.exports = {
  serviceClass: TimestampService,
  schema: schema,
  bootBefore: ['statebox']
}
