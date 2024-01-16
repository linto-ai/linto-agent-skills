const debug = require('debug')('linto:skill:v2:linto-skill:news:controllers:exception:language')

class LanguageNotSupportedException extends Error {
  constructor(message) {
    super()
    this.name = 'LanguageNotSupportedException'
    this.message = message
  }
}

module.exports = {
  LanguageNotSupportedException
}