class DummyUserInfoService {
  boot (options) {
    options.messages.info('Dummy User Info Service')
  }

  /**
   * Converts a provider user id into an email address, by some means
   * @param {string} userId a provider use id
   * @param callback callback function, whose first parameter holds error details or {undefined}, and whose second parameter holds the email address returned by the auth0 web api
   * @returns {undefined}
   */
  emailFromUserId (userId) {
    const emails = {
      'auth0|5a157ade1932044615a1c502': 'tymly@xyz.com'
    }

    return Promise.resolve(emails[userId])
  }
}

module.exports = {
  serviceClass: DummyUserInfoService,
  bootBefore: ['statebox']
}
