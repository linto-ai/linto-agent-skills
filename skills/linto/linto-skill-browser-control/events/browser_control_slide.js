const debug = require('debug')(`linto:skill:v2:linto-skill:browser-control:events:slide`)
const intent = 'room_control_slide'
module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

  if (msg.payload.nlu.entitiesNumber !== 1) return { say: tts.say.error_entities_number }

  let action
  for (let payloadEntity of msg.payload.nlu.entities) {
    if (payloadEntity.entity === 'next') action = 'next'
    else if (payloadEntity.entity === 'previous') action = 'previous'
  }

  return {
    customAction: {
      kind: 'slide_' + action
    },
    say: {
      phonetic: intent + '_' + action,
      text: intent + '_' + action
    }
  }
}