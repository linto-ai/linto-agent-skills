const debug = require('debug')('linto:skill:v2:linto-skill:definition')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Definition'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillDefinition(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-definition', Node,
    {
      settings: {
        lintoSkillDefinition: {
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

class LintoSkillDefinition extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.payloadAction = payloadAction
    
    this.init()
  }

  async init() {
    await this.configure() // Autoload controllers
  }
}