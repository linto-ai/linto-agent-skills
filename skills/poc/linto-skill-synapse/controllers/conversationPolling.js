const debug = require('debug')(`linto:skill:v2:linto-skill:synapse:controllers:conversationPolling`)

const ATTEMPTS_BEFORE_EXCEPTION = 30
const MAX_ATTEMPTS = 30
const POLLING_INTERVAL = 1000

module.exports = async function (chatbot, user_conversation) {
  const options = {
    headers: {
      'content-type': 'application/json',
      botKey: chatbot.bot_key
    },
    json: true
  }
  const executePolling = async (resolve, reject) => {
    try {

      debug(`GET .../${user_conversation.conversation_id}/messages?watermark=${user_conversation.watermark} - Attemps : ${user_conversation.attempts}/${MAX_ATTEMPTS}`)
      const result = await this.request.get(`${chatbot.api}/${user_conversation.conversation_id}/messages?watermark=${user_conversation.watermark}`, options)

      user_conversation.attempts++

      if (result.result && result.result.activities && result.result.activities.length !== 0) {
        const text = result.result.activities.reduce((acc, activitie) => acc + activitie.text, '')

        let attachments = []
        result.result.activities.map(acc => {
          if (acc.attachments) acc.attachments.map(attachment => {
            if (attachment.type === 0 || attachment.type === 2 || attachment.type === 14)
              attachments.push(attachment)
          })
        })

        user_conversation.watermark += result.result.activities.length
        resolve({
          text,
          attachments,
          user_conversation,
          result
        })
      }
      else if (user_conversation.attempts === ATTEMPTS_BEFORE_EXCEPTION && result.exceptions.errcode !== 0) reject(new Error(result.exceptions.message))
      else if (user_conversation.attempts === MAX_ATTEMPTS) reject(new Error('Exceeded max attempts'))
      else setTimeout(executePolling, POLLING_INTERVAL, resolve, reject)
    } catch (err) {
      throw (err)
    }
  }

  return new Promise(executePolling)
}