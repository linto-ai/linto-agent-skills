const debug = require('debug')(`linto:skill:v2:linto-skill:linto-skill-greeting-demo:events:greeting-demo`)

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

  return {
    say: {
      phonetic: `${tts.say.greeting.phonetic}`,
      text: `${tts.say.greeting.text}`
    }
  }
}