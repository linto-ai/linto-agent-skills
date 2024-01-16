const debug = require('debug')(`linto:skill:v2:core:transcribe-streaming:linstt`)
const WebSocket = require('ws')
const DEFAULT_CONFIG = '{"config": {"sample_rate":16000, "metadata":1 }}'

let websocket = {}

module.exports = async function (msg) {
  const tts = this.tts[this.getFlowConfig('language').language]

  const largeVocabStreaming = this.config.transcribe.ws + this.config.transcribe.largeVocabStreaming
  const sn = msg.mqtt.sn
  let topic = msg.mqtt.partial

  switch (msg.data.trigger.type) {
    case 'start':

      if(!websocket[sn]){
        startWS.call(this, largeVocabStreaming, sn, topic, msg)
        this.sendPayloadToLinTO(topic + '/start', { streaming: { status: 'started' } })
      }else this.sendPayloadToLinTO(topic + '/error', { streaming: { status: 'started', message: tts.say.streaming_already_started.text } })
      break

    case 'stop':
      if (websocket[sn]) {
          stopWS(sn)
          this.sendPayloadToLinTO(topic + '/stop', { streaming: { status: 'stop' } })
      } else this.sendPayloadToLinTO(topic + '/error', { streaming: { status: 'stop', message: tts.say.streaming_not_started.text } })
      break

    case 'chunk':
      if (websocket[sn]) {
        if(this.config.limited && websocket[sn].chunkSend >= this.config.chunk){
          stopWS(sn)
          this.sendPayloadToLinTO(topic + '/stop', { streaming: { status: 'stop' } })
        } else onMessage(msg.payload.chunk, sn)
      }else this.sendPayloadToLinTO(topic + '/error', { streaming: { status: 'chunk', message: tts.say.streaming_not_started.text } })
      break

  }
  return msg
}

function startWS(host, id, topic, msg) {
  websocket[id] = new WebSocket(host)
  websocket[id].linto_id = id
  websocket[id].linto_topic = topic
  websocket[id].skillLinto = this
  websocket[id].chunkSend = 0

  websocket[id].on('close', () => {
    console.log('Client disconnected from ' + host)
  })

  websocket[id].on('error', () => {
    console.log('ERROR with host :' + host)
    stopWS(id)
    this.sendPayloadToLinTO(topic + '/error', { streaming: { status: 'error' } })
  })

  websocket[id].on('open', function open() {
    if (msg.payload.config) {
      delete msg.payload.auth_token
      this.send(JSON.stringify(msg.payload))
    }
    else this.send(DEFAULT_CONFIG)
  })

  websocket[id].on('message', function incoming(msg) {
    const topicChunk = this.linto_topic + '/chunk'
    const topicFinal = this.linto_topic + '/final'

    let data = JSON.parse(msg)
    if ('partial' in data) this.skillLinto.sendPayloadToLinTO(topicChunk, { streaming: { partial: data.partial } }, 0)
    else if ('text' in data && !('words' in data)) this.skillLinto.sendPayloadToLinTO(topicChunk, { streaming: { text: data.text } })
    else if ('words' in data) {
      this.skillLinto.sendPayloadToLinTO(topicFinal, { streaming: { status: 'final', result: JSON.stringify(data, null, 4) } })

      //Wait final answer before stoping service
      websocket[id].close()
      delete websocket[id]
    } else if ('eod' in data) this.close()
    else console.error("unsupported msg", data)
  })

}

function stopWS(id) {
  if (websocket[id] && websocket[id].readyState === WebSocket.OPEN) {
    websocket[id].send('{"eof" : 1}')
    websocket[id].on('close', function close() {
      console.log('disconnected')
    })

    setTimeout(function () {
      if(websocket[id]){
        websocket[id].close()
        delete websocket[id]
      }
    }, 3000)

  }
}

function onMessage(chunk, _id) {
  if (websocket[_id] && websocket[_id].readyState === WebSocket.OPEN){
    websocket[_id].send(chunk)
    ++websocket[_id].chunkSend
  }
}