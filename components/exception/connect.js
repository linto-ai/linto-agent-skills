const debug = require('debug')('linto:linto-components:exception:connect')

class HostUndefined extends Error {
  constructor(message) {
    super()
    this.name = 'HostUndefined'
    this.message = message
  }
}

class TopicScopeUndefined extends Error {
  constructor(message) {
    super()
    this.name = 'TopicScopeUndefined'
    this.message = message
  }
}
class WrongFormat extends Error {
  constructor(message) {
    super()
    this.name = 'WrongFormat'
    this.message = message
  }
}


module.exports = {
  HostUndefined,
  TopicScopeUndefined,
  WrongFormat
}