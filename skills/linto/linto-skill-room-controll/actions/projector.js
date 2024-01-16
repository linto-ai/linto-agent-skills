const debug = require('debug')(`linto:skill:v2:linto-skill:room-control:actions:projector`)
const intent = 'room_control_projector'

module.exports = function (msg) {
  if (msg.payload.action.on) action = 'on'
  else if(msg.payload.action.off) action = 'off'
  else action = 'undefined'

  return {
    customAction: {
      kind: 'projector_' + action
    }
  }
}