const debug = require('debug')(`linto:skill:v2:linto-skill:template:events:myEvent`)

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig
  let addition = this.controller.addition(2, 1) // controller call

  return {
    say: {
      phonetic: `${tts.say.additionResult.phonetic} ${addition}`,
      text: `${tts.say.additionResult.text} ${addition}`
    }
  }
}