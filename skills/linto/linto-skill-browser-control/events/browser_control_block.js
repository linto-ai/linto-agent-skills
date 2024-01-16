const debug = require('debug')(`linto:skill:v2:linto-skill:browser-control:events:block`)
const intent = 'browser_control_block'

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
      kind: 'block_' + action
    },
    say: {
      phonetic: intent + '_' + action,
      text: intent + '_' + action
    }
  }
}