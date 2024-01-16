const debug = require('debug')('linto:skill:v2:linto-skill:datetime')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Datetime'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillDatetime(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-datetime', Node,
    {
      settings: {
        lintoSkillDatetime: {
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

class LintoSkillDatetime extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.init()
  }

  async init() {
    await this.configure() // Autoload controllers
  }
}