const debug = require('debug')('linto:skill:v2:core:linto-chatbot')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode
const { request } = require('@linto-ai/linto-components').components
const tts = require('./data/tts')


module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoChatbot(RED, this, config)
  }
  RED.nodes.registerType('linto-chatbot', Node)
}

class LintoChatbot extends LintoCoreEventNode {
  constructor(RED, node, config) {
    super(RED, node, config)

    this.config = {
      ...config,
      chatbot: { ...this.getFlowConfig('configChatbot') },
    }
    this.tts = tts
    
    this.request = request
    this.subscribeFunctionToEvent(this.node.z, this.wireEvent.eventData.core.chatbot, `${__dirname}/api/tock-chatbot`)
  }
}