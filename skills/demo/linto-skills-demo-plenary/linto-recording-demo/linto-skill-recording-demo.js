const debug = require('debug')('linto:skill:v2:linto-skill:linto-skill-recording-demo')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Recording'
const SKILL_NAME = 'linto-skill-recording-demo'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillRecordingDemo(RED, this, config)
  }

  RED.nodes.registerType(SKILL_NAME, Node,
    {
      settings: {
        lintoSkillRecordingDemo: {
          value: {
            skillName: SKILL_NAME,  // CHECK HERE
            template: template.settupSkillTemplate(PALETTE_NODE_NAME),
            command: LintoSkillNode.loadFile(__dirname, 'data/command.md'),
          },
          exportable: true
        }
      }
    })
}

class LintoSkillRecordingDemo extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.payloadAction = payloadAction
    this.init()
  }

  async init() {
    await this.configure() // Autoload controllers
  }
}