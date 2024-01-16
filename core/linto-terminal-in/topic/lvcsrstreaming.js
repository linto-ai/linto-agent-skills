const debug = require('debug')(`linto:skill:v2:core:terminal-in:topic:lvcsrstreaming`)

module.exports = async function (topic, rawPayload) {
  try {
    const [_clientCode, _channel, _sn, _etat, _type] = topic.split('/')
    
    let msg = {
      mqtt :  {
        ingress: topic,
        egress: `${_clientCode}/tolinto/${_sn}/${_etat}/${_type}`,
        partial: `${_clientCode}/tolinto/${_sn}/${_etat}`,
        sn : _sn
      },
      data : {
        trigger : {
          etat : _etat,
          type : _type,
        },
      },
      payload : {}
    }

    switch (_type) {
      case 'start':
        msg.payload = JSON.parse(rawPayload)
        this.wireNode.nodeSend(this.node, msg)
        break
      case 'stop':
        msg.payload = JSON.parse(rawPayload)
        this.wireNode.nodeSend(this.node, msg)
        break
      case 'chunk':
        msg.payload.chunk = rawPayload
        this.wireNode.nodeSend(this.node, msg)
        break
      default:
        break
    }
    this.cleanStatus()
  } catch (err) {
    this.sendStatus('red  ', 'ring', err.message)
  }
}