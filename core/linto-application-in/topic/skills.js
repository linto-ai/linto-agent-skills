const debug = require('debug')(`linto:skill:v2:core:application-in:topic:skills`)

module.exports = async function (topic, rawPayload) {
  try {
    const [_clientCode, _channel, _sn, _etat, _skill_name, _action_name] = topic.split('/')

    const payload = JSON.parse(rawPayload)
    const msg = {
      mqtt :  {
        ingress: topic,
        egress: `${_clientCode}/tolinto/${_sn}/${this.wireEvent.eventData.skill.action}/${_skill_name}/${_action_name}`,
        sn : _sn
      },
      data : {
        trigger : {
          etat : _etat,
          skill : _skill_name,
          action : _action_name 
        }
      },
      payload
    }

    this.wireNode.nodeSend(this.node, msg)

    this.cleanStatus()
  } catch (err) {
    this.sendStatus('red  ', 'ring', err.message)
  }
}