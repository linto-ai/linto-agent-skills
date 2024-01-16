const debug = require('debug')(`linto:skill:v2:core:chatbot:tock`)

const eventType = {
  attachment: 'attachment',
  button: 'choice',
  sentence: 'sentence'
}

module.exports = async function (msg) {
  let node = this
  const tts = this.tts[this.getFlowConfig('language').language]

  try {
    if (msg.payload.conversationData) {/*TODO: Future update*/ }
    node.sendStatus('green', 'ring')

    if(msg.payload.transcript)
      msg.payload.text = msg.payload.transcript


    if (!this.config.chatbot.host || !this.config.chatbot.rest)
      this.sendEventError(msg, { ...tts.say.missingConfig, errMessage: 'Missing server configuration', code: 500 })
    else if (!msg.payload.text) //TODO: no text found
      this.sendEventError(msg, { ...tts.say.missingText, errMessage: 'Missing information', code: 500 })
    else {
      let options = prepareRequest.call(this, msg.payload.text, msg.mqtt.sn)
      let requestResult = await this.request.post('http://'+this.config.chatbot.host + this.config.chatbot.rest, options)
     
      msg.payload.behavior = {
        chatbot: {
          ask: msg.payload.text,
          answer: wrapper(requestResult)
        }
      }

      setTimeout(function () {
        node.cleanStatus()
      }, node.statusTimer)

      this.sendToLinto(msg)
    }
  } catch (err) {
    this.sendEventError(msg, {...tts.say.serverErr, errMessage: err.body, code: 500 })
    throw new Error(err.body)
  }
}

function prepareRequest(text, userId) {
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    body: {
      query: text,
      userId: userId
    },
    json: true
  }

  return options
}


function wrapper(answer) {
  let output = {
    text: '',
    data: []
  }

  try {
    answer.responses.map(msg => {
      if (msg.text) {
        output.text += msg.text + ' '
        output.data.push({
          text: msg.text,
          eventType: eventType.sentence
        })
      }

      if (msg.buttons) {
        msg.buttons.map(button => {
          output.data.push({
            text: button.title,
            eventType: eventType.button
          })
        })
      }

      if (msg.card) {
        output.data.push({
          title: msg.card.title,
          subTitle: msg.card.subTitle,
          file: msg.card.file,
          type: msg.card.file.type,
          eventType: eventType.attachment
        })
      }
    })
    return output
  } catch (err) {
    throw err
  }
}