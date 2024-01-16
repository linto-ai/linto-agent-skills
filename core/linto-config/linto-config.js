const debug = require('debug')('linto:skill:v2:core:linto-config')
const LintoNode = require('@linto-ai/linto-components').nodes.lintoNode

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoConfig(RED, this, config)
  }
  RED.nodes.registerType('linto-config', Node)
}

class LintoConfig extends LintoNode {
  constructor(RED, node, config) {
    super(node, config)

    this.setFlowConfig('language', { language: config.language, lang: config.language.split('-')[0] })

    if(RED.nodes.getNode(config.configMqtt))
      this.setFlowConfig('confMqtt', RED.nodes.getNode(config.configMqtt).config)
    if(RED.nodes.getNode(config.configEvaluate))
      this.setFlowConfig('configEvaluate', RED.nodes.getNode(config.configEvaluate).config)
    if(RED.nodes.getNode(config.configChatbot))
      this.setFlowConfig('configChatbot', RED.nodes.getNode(config.configChatbot).config)
    if(RED.nodes.getNode(config.configTranscribe))
      this.setFlowConfig('configTranscribe', RED.nodes.getNode(config.configTranscribe).config)
  }
}