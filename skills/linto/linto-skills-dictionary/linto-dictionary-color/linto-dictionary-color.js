const debug = require('debug')('linto:skill:v2:core:dictionary')
const LintoDictionaryCoreNode = require('@linto-ai/linto-components').nodes.lintoDictionaryCoreNode
const { template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'color'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)

    new LintoDictionaryColor(RED, this, config)
  }

  RED.nodes.registerType('linto-dictionary-color', Node,
  {
    settings: {
      lintoDictionaryColor: {
        value: {
          template: template.settupDictionaryTemplate(PALETTE_NODE_NAME),
          dataEntity: LintoDictionaryCoreNode.loadFile(__dirname, 'data/color.md'),
          nameEntity : PALETTE_NODE_NAME
        },
        exportable: true
      }
    }
  })
}

class LintoDictionaryColor extends LintoDictionaryCoreNode {
  constructor(RED, node, config) {
    super(RED, node, config)
  }
}
