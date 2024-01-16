const debug = require('debug')('linto:skill:v2:core:linto-tts')
const LintoCoreNode = require('@linto-ai/linto-components').nodes.lintoCoreNode
const { request, wireEvent } = require('@linto-ai/linto-components').components

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoTts(RED, this, config)
  }
  RED.nodes.registerType('linto-tts', Node)
}

class LintoTts extends LintoCoreNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireEvent = wireEvent.init(RED)
    this.init()
  }

  async init() {

  }
}

async function audio(text) {
  let get_url_status = 'GET_STATUS'
  let post_url_transcript = 'POST_TRANSCRIPT'

  let status = await this.request.get(get_url_status)
  if (status === 200) {
    let form = {
      key: "text",
      value: text
    }

    let audio = await this.request.post(post_url_transcript, form)
    if (audio)
      return audio
  }
  return { say: text }  // If TTS not on, should send for pico format
}