const debug = require('debug')('linto:skill:v2:linto-skill:calendar')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Calendar'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillCalendar(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-calendar', Node,
    {
      settings: {
        lintoSkillCalendar: {
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

class LintoSkillCalendar extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.init()
  }

  async init() {
    await this.configure() // Autoload controllers
    this.payloadAction = payloadAction

    this.controller.openpaasCal = new this.controller.openpaasCal(this.config, this.skillConfig.language)
    await this.controller.openpaasCal.init()

    if (!this.controller.openpaasCal.authorization || !this.controller.openpaasCal.userId) {
      this.sendStatus('red', 'ring', 'Connecting error')
    } else {
      this.controller.calendarLogic = new this.controller.calendarLogic(this.controller.openpaasCal, this.skillConfig[this.skillConfig.language], payloadAction)
      this.cleanStatus()
    }
  }
}