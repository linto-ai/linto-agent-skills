const debug = require('debug')('linto:skill:v2:linto-skill:welcome:events:greeting')

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]

  return { say: tts.say.greeting }
}