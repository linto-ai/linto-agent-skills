const debug = require('debug')('linto:skill:v2:linto-skill:datetime:events:date')

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]
  return {
    say: {
      phonetic: `${tts.say.date.phonetic} ${new Date().toISOString().split('T')[0]}`,
      text: `${tts.say.date.text} ${new Date().toISOString().split('T')[0]}`
    }
  }
}