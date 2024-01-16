const debug = require('debug')(`linto:skill:v2:linto-skill:room-control:actions:light`)
const intent = 'room_control_light'
module.exports = function (msg) {
  debug(msg)
  if (msg.payload.action.on) action = 'on'
  else if (msg.payload.action.off) action = 'off'
  else action = 'undefined'

  return {
    customAction: {
      kind: 'light_' + action
    }
  }
}