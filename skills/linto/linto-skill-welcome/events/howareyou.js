const debug = require('debug')('linto:skill:v2:linto-skill:welcome:events:howareyou')

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]

  if (!msg.payload.isConversational) {
    return { ask: tts.say.howareyou, conversationData: msg.payload.nlu }
  } else {
    if (this.payloadAction.checkEntitiesRequire(msg.payload, ['isok'])) {
      return { say: tts.say.isok, conversationData: {} }
    } else if (this.payloadAction.checkEntitiesRequire(msg.payload, ['isko'])) {
      return { say: tts.say.isko, conversationData: {} }
    } else {
      return { say: tts.say.status_unk, conversationData: {} }
    }
  }
}