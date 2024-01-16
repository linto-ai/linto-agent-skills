const debug = require('debug')('linto:skill:v2:linto-skill:chatbot-synapse')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode
const { request } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Synapse'
const SKILL_NAME = 'linto-skill-synapse'


module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillSynapse(RED, this, config)
  }
  RED.nodes.registerType(SKILL_NAME, Node)
}

class LintoSkillSynapse extends LintoCoreEventNode {
  constructor(RED, node, config) {
    super(RED, node, config)
    this.request = request

    this.config = {
      ...config,
      chatbot : {
          api : `${this.config.host}/line/synapse/bot/${this.config.botId}/conversation/`,
          bot_key : this.config.botKey
      }
    }

    this.subscribeFunctionToEvent(this.node.z, this.wireEvent.eventData.core.chatbot, `${__dirname}/api/chatbot`)
  }
}