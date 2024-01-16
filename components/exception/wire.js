const debug = require('debug')('linto:linto-components:exception:wire')

class WireEventHandlerException extends Error {
  constructor(message) {
    super()
    this.name = 'WireEventHandlerException'
    this.message = message
  }
}

module.exports = {
  WireEventHandlerException
}