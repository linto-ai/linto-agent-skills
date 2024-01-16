const debug = require('debug')('linto:skill:v2:linto-skill:welcome:events:goodbye')

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]
  return { say: tts.say.goodbye }
}