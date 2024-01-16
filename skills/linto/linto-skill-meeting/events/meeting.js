const debug = require('debug')('linto:skill:v2:linto-skill:meeting:events:meeting')

const TO_UI = 'to-linto-ui'

module.exports = async function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]

  if (this.payloadAction.checkEntitiesRequire(msg.payload, ['action_start'])) {
    if (this.config.ui) {
      let htmlPayload = {
        payload: {
          html: ""
        }
      }

      if (!this.html) {
        this.text = 'my default text '
      }

      if (this.meetingsInterval)
        clearInterval(this.meetingsInterval)

      this.meetingsInterval = setInterval(() => {
        htmlPayload.payload.html = this.text += Math.floor(Math.random() * 20) + ' ' //TODO: WIP: Get data from meetings API
        this.wireEvent.notify(`${this.config.z}-${TO_UI}`, htmlPayload)
      }, this.config.uiInterval)
    }
    return { say: tts.say.start }
  } else if (this.payloadAction.checkEntitiesRequire(msg.payload, ['action_stop'])) {
    if (this.config.ui && this.meetingsInterval) {
      clearInterval(this.meetingsInterval)
      this.meetingsInterval = undefined
    }
    return { say: tts.say.stop }
  }

  return { say: tts.say.status_unk }
}
