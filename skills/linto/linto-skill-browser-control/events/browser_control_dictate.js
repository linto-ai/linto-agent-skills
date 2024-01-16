const debug = require('debug')(`linto:skill:v2:linto-skill:browser-control:events:dictate`)
const intent = 'browser_control_dictate'

module.exports = function (msg) {
  return {
    customAction: {
      kind: 'dictate'
    },
    say: {
      phonetic: intent,
      text: intent
    }
  }
}