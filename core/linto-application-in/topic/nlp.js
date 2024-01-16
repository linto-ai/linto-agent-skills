const debug = require('debug')(`linto:skill:v2:core:application-in:topic:nlp`)

module.exports = async function (topic, rawPayload) {
  try {
    const [_clientCode, _channel, _sn, _etat, _type, _id] = topic.split('/')
    const tts = this.tts[this.getFlowConfig('language').language]
    const payload = JSON.parse(rawPayload)

    let event
    if(_type === 'file') event = this.wireEvent.eventData.core.transcribe
    else if (_type ==='text') event = this.wireEvent.eventData.core.evaluate
    else this.sendEventError(msg, { ...tts.say.nlp_topic_type_unknown, errMessage: 'Missing information', code: 500 })
    
    const msg = {
      mqtt :  {
        ingress: topic,
        egress: `${_clientCode}/tolinto/${_sn}/${_etat}/${_type}/${_id}`,
        sn : _sn
      },
      data : {
        trigger : {
          etat : _etat,
          type : _type,
          event
        },
        confidence : {
          stt : { useConfidenceScore : false},
          nlu : { useConfidenceScore : false}
        },
        // token : payload.auth_token
      },
      payload
    }

    // delete payload.auth_token

    if(msg.data.trigger.type === 'file' && !msg.payload.audio )
      this.sendEventError(msg, { ...tts.say.require_param_missing, errMessage: 'Missing information', code: 500 })
    else if(msg.data.trigger.type === 'text' && !msg.payload.text)
      this.sendEventError(msg, { ...tts.say.require_param_missing, errMessage: 'Missing information', code: 500 })
    else this.wireNode.nodeSend(this.node, msg)
    
    this.cleanStatus()
  } catch (err) {
    this.sendStatus('red  ', 'ring', err.message)
  }
}