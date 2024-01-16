const debug = require('debug')('linto:linto-components:exception:terminal-out')

class ToAskTerminalException extends Error {
  constructor(message) {
    super()
    this.name = 'ToAskException'
    this.message = message
  }
}

class ToSayTerminalException extends Error {
  constructor(message) {
    super()
    this.name = 'ToSayException'
    this.message = message
  }
}

class ToUiTerminalException extends Error {
  constructor(message) {
    super()
    this.name = 'ToUiException'
    this.message = message
  }
}

module.exports = {
  ToAskTerminalException,
  ToSayTerminalException,
  ToUiTerminalException
}