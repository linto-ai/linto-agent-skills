const debug = require('debug')(`linto:skill:v2:linto-skill:room-control:actions:slide`)
const intent = 'room_control_shutter'

module.exports = function (msg) {
  if (msg.payload.action.next) action = 'next'
  else if(msg.payload.action.previous) action = 'previous'
  else action = 'undefined'

  return {
    customAction: {
      kind: 'slide_' + action
    }
  }
}