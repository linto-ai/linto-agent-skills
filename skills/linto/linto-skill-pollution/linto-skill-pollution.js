const debug = require('debug')('linto:skill:v2:linto-skill:pollution')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, request, template, wireNode } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Pollution'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillPollution(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-pollution', Node,
    {
      settings: {
        lintoSkillPollution: {
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

class LintoSkillPollution extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.payloadAction = payloadAction

    this.init()
  }

  async init() {
    this.request = request
    await this.configure() // Autoload controllers
  }
}