const debug = require('debug')('linto:skill:v2:linto-skill:news')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template, request } = require('@linto-ai/linto-components').components


const PALETTE_NODE_NAME = 'News'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillNews(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-news', Node,
    {
      settings: {
        lintoSkillNews: {
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


class LintoSkillNews extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.init()
  }

  async init() {
    this.payloadAction = payloadAction
    this.request = request

    await this.configure() // Autoload controllers
  }
}