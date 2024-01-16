

const debug = require('debug')(`linto:skill:v2:linto-skill:synapse:controllers:conversationWrapper`)

module.exports = function (conversation) {
  let result = {
    customAction: { kind: '' },
    data: {
      // can have url, button + question
      button: [],
      url: [],
      sentiment: [],
    },
    synapse: conversation.result
  }
  if (!conversation) return result

  if (conversation.attachments.length === 0) {
    return {
      say: {
        text: conversation.text,
        phonetic: conversation.text
      }
    }
  } else {
    if (!conversation.text.includes('<p>')) {
      result.customAction.kind = 'html'
      result.data.text = conversation.text
    } else if (conversation.text.includes('<p>')) {
      result.customAction.kind = 'html'
      result.data.html = conversation.text

      if (conversation.text.includes('base64')) {
        result.customAction.kind = 'html_base64'
      }
    }

    conversation.attachments.map(attachment => {
      if (attachment.type === 0) { // button
        let dataValue = { text: attachment.text, value: attachment.key }
        result.data.button.push(dataValue)

      } else if (attachment.type === 2) { // url
        result.data.url.push(attachment.url)

      } else if (attachment.type === 14) { // sentiment
        attachment.buttons.map(button => {
          result.data.sentiment.push({ text: button.text, value: button.key, textOnClick: button.finalMessage/*, question: attachment.text*/ })
        })
      }
    })
    //remove empty data from result
    if (result.data.button.length === 0) delete result.data.button
    if (result.data.url.length === 0) delete result.data.url
    if (result.data.sentiment.length === 0) delete result.data.sentiment

    return result
  }
}