const debug = require('debug')(`linto:skill:v2:linto-skill:room-control:actions:shutter`)
const intent = 'room_control_shutter'

module.exports = function (msg) {
  if (msg.payload.action.on) action = 'on'
  else if(msg.payload.action.off) action = 'off'
  else action = 'undefined'

  return {
    customAction: {
      kind: 'shutter_' + action
    }
  }
}