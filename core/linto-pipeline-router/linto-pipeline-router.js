const debug = require('debug')('linto:skill:v2:core:linto-pipeline-router')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode
const { redAction, wireNode } = require('@linto-ai/linto-components').components

const tts = require('./data/tts')
const error = require('./data/error')

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoPipelineRouter(RED, this, config)
  }
  RED.nodes.registerType('linto-pipeline-router', Node)
}

class LintoPipelineRouter extends LintoCoreEventNode {
  constructor(RED, node, config) {
    super(RED, node, config)
    this.config = {
      ...config,
    }
    this.RED = RED
    this.wireNode = wireNode

    this.init()
  }

  async init() {
    this.wireNode.onMessage(this, routerOutputManager.bind(this))
  }
}

function routerOutputManager(msg) {
  switch (msg.data.trigger.etat) {
    case 'nlp':
      this.wireEvent.notifyCore(this.node.z ,msg.data.trigger.event, msg)
      break
    case 'streaming':
      this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.streaming, msg)
      break
    case 'chatbot':
      this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.chatbot, msg)
      break
    case 'skills':
      this.wireEvent.notifyAction(this.node.z, msg.data.trigger.action, msg)
      break
    default:
      this.wireEvent.notifyOut(msg.payload.topic, { status: "error", message: error.unsuportedSkill })
      throw new Error(error.unsuportedTopic.message)
  }
}