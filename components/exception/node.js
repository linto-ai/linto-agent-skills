const debug = require('debug')('linto:linto-components:exception:node')

class InitSkillException extends Error {
  constructor(message) {
    super()
    this.name = 'InitSkillException'
    this.message = message
  }
}

class AutoLoadException extends Error {
  constructor(message) {
    super()
    this.name = 'AutoLoadException'
    this.message = message
  }
}

class UnknownLanguageException extends Error {
  constructor(message) {
    super()
    this.name = 'UnknownLanguageException'
    this.message = message
  }
}

module.exports = {
  InitSkillException,
  AutoLoadException,
  UnknownLanguageException
}