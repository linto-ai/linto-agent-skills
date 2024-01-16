const debug = require('debug')(`linto:skill:v2:linto-skill:linto-skill-room-control-demo:events:room-control-demo`)

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

  return {
    say: {
      phonetic: `${tts.say.projector_started.phonetic}`,
      text: `${tts.say.projector_started.text}`
    }
  }
}