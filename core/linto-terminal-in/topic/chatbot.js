const debug = require('debug')(`linto:skill:v2:core:terminal-in:topic:chatbot`)

module.exports = async function (topic, rawPayload) {
  try {
    const [_clientCode, _channel, _sn, _etat, _id] = topic.split('/')
    const tts = this.tts[this.getFlowConfig('language').language]

    const payload = JSON.parse(rawPayload)
    const msg = {
      mqtt :  {
        ingress: topic,
        egress: `${_clientCode}/tolinto/${_sn}/${_etat}/${_id}`,
        sn : _sn
      },
      data : {
        trigger : {
          etat : _etat
        }
      },
      payload
    }

    if(!payload.text) 
      this.sendEventError(msg, { ...tts.say.require_param_missing, errMessage: 'Missing information', code: 500 })
    else 
      this.wireNode.nodeSend(this.node, msg)
    
    this.cleanStatus()
  } catch (err) {
    this.sendStatus('red  ', 'ring', err.message)
  }
}