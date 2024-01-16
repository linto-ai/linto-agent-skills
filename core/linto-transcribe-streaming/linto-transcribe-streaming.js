const debug = require('debug')('linto:skill:v2:core:linto-transcribe-streaming')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode

const { request } = require('@linto-ai/linto-components').components
const tts = require('./data/tts')

const DEFAULT_CHUNK_NUMBER = 150

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoTranscribe(RED, this, config)
  }
  RED.nodes.registerType('linto-transcribe-streaming', Node)
}

class LintoTranscribe extends LintoCoreEventNode {

  constructor(RED, node, config) {
    super(RED, node, config)

    this.config = {
      ...config,
      transcribe: { ...this.getFlowConfig('configTranscribe') }
    }

    if(this.config.chunk) this.config.chunk = parseInt(this.config.chunk)
    else this.config.chunk = DEFAULT_CHUNK_NUMBER

    this.tts = tts

    this.request = request
    this.subscribeFunctionToEvent(this.node.z, this.wireEvent.eventData.core.streaming, `${__dirname}/api/linstt`)
  }
}
