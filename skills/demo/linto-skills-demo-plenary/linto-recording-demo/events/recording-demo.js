const debug = require('debug')(`linto:skill:v2:linto-skill:linto-skill-recording-demo:events:recording-demo`)

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

  return {
    say: {
      phonetic: `${tts.say.recording_start.phonetic}`,
      text: `${tts.say.recording_start.text}`
    }
  }
}