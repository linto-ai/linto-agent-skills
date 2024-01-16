const debug = require('debug')('linto:skill:v2:linto-skill:meeting')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template, wireNode } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Meeting'
const DEFAULT_UI_INTERVAL = 1000

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillMeeting(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-meeting', Node,
    {
      settings: {
        lintoSkillMeeting: {
          value: {
            template: template.settupSkillTemplate(PALETTE_NODE_NAME),
            command: LintoSkillNode.loadFile(__dirname, 'data/command.md'),
            description: LintoSkillNode.loadFile(__dirname, 'data/description.json')
          },
          exportable: true
        }
      }
    })
}


class LintoSkillMeeting extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.payloadAction = payloadAction
    this.init()
  }

  async init() {
    if (!this.config.uiInterval)
      this.config.uiInterval = DEFAULT_UI_INTERVAL

    await this.configure() // Autoload controllers

    this.node.on('close', (remove, done) => {
      if(this.meetingsInterval)
        clearInterval(this.meetingsInterval)
      done()
    })
  }
}