const debug = require('debug')('linto:skill:v2:core:linto-evaluate')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode
const { request } = require('@linto-ai/linto-components').components
const tts = require('./data/tts')

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoEvaluate(RED, this, config)
  }
  RED.nodes.registerType('linto-evaluate', Node)
}

class LintoEvaluate extends LintoCoreEventNode {
  constructor(RED, node, config) {
    super(RED, node, config)

    this.config = {
      ...config,
      evaluate: { ...this.getFlowConfig('configEvaluate') }
    }
    this.tts = tts

    this.request = request
    this.subscribeFunctionToEvent(this.node.z, this.wireEvent.eventData.core.evaluate, `${__dirname}/api/${this.config.evaluate.api}`)
  }
}