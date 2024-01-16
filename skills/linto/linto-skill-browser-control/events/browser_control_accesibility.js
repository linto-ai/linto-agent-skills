const debug = require('debug')(`linto:skill:v2:linto-skill:browser-control:events:accesibility`)
const intent = 'browser_control_accesibility'

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

  if (msg.payload.nlu.entitiesNumber !== 1) return { say: tts.say.error_entities_number }


  let action
  for (let payloadEntity of msg.payload.nlu.entities) {
    if (payloadEntity.entity === 'on') action = 'on'
    else if (payloadEntity.entity === 'off') action = 'off'
  }

  return {
    customAction: {
      kind: 'accesibility_' + action
    },
    say: {
      phonetic: intent + '_' + action,
      text: intent + '_' + action
    }
  }
}