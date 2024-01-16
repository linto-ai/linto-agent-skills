const debug = require('debug')('linto:skill:v2:linto-skill:calendar:events:calendar')

module.exports = async function (msg) {
  try {
    let tts = this.skillConfig[this.skillConfig.language]

    if (!this.controller.openpaasCal.authorization || !this.controller.openpaasCal.userId) {
      this.sendStatus('red', 'ring', tts.error.unauthorized)
      return { say: tts.error.config }
    }

    if (msg.payload.isConversational) {
      return await this.controller.calendarLogic.conversationCreate(msg.payload)    //TODO: CALENDAR_LOGIC NOT INIT ERROR
    } else {
      return await this.controller.calendarLogic.sayIntent(msg.payload)
    }
  } catch (err) {
    console.log(err)
  }
}