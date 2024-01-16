const debug = require('debug')(`linto:skill:v2:linto-skill:actions:synapse:chatbot`)

const conversationPolling = require(`../controllers/conversationPolling`)
const conversationWrapper = require(`../controllers/conversationWrapper`)
const getUserConversation = require(`../controllers/getUserConversation`)
const sendMessage = require(`../controllers/sendMessage`)

const BOT_SESSION_TIMEOUT = 1800000

let user_conversation = {}


// {"behavior":{"say":{"text":"Cela dépasse mon champ de connaissances. Avez-vous une autre question à me poser ?","phonetic":"Cela dépasse mon champ de connaissances. Avez-vous une autre question à me poser ?"}}}
// {"behavior":{"chatbot":{"ask":"Bonjour","answer":{"say":{"text":"Très heureux de pouvoir discuter avec vous, comment puis-je vous aider ?","phonetic":"Très heureux de pouvoir discuter avec vous, comment puis-je vous aider ?"}}}}}

module.exports = async function (msg) {
  try {
    let node = this

    const sn = msg.mqtt.sn
    if (user_conversation[sn] === undefined) { // Init user conversation if not exist
      let result_conversation_id = await getUserConversation.call(this, this.config.chatbot, sn)
      if (result_conversation_id.result !== undefined) {
        user_conversation[sn] = {
          serial_number: sn,
          conversation_id: result_conversation_id.result,
          watermark: 0,
          attempts: 0
        }

        setTimeout(() => {
          debug('Synapse chatbot session deleted')
          delete user_conversation[sn]
        }, BOT_SESSION_TIMEOUT)
      } else {
        return { error: 'Error during the conversation creation' }
      }
    }

    const text = msg.payload.text
    user_conversation[sn] = await sendMessage.call(this, this.config.chatbot, user_conversation[sn], text)

    const conversationPromise = conversationPolling.call(this, this.config.chatbot, user_conversation[sn])
    let conversationResult = await conversationPromise.then(res => {
      user_conversation[sn].attempts = 0

      const conversationWrapped = conversationWrapper(res)
      msg.payload.behavior = {
        chatbot: {
          ...conversationWrapped,
          question: msg.payload.text
        }
      }

      setTimeout(function () {
        node.cleanStatus()
      }, node.statusTimer)

      this.sendToLinto(msg)
    }).catch(err => {
      user_conversation[sn].attempts = 0
      throw err
    })

    return conversationResult
  } catch (error) {
    if (error.body && error.body.message) return { error: error.body.message }
    else {
      return {
        state: 'error',
        error: error.message
      }
    }
  }
}
