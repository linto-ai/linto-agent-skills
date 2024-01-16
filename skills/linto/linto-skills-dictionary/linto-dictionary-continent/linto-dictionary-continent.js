const debug = require('debug')('linto:skill:v2:core:dictionary')
const LintoDictionaryCoreNode = require('@linto-ai/linto-components').nodes.lintoDictionaryCoreNode
const { template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'continent'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)

    new LintoDictionaryContinent(RED, this, config)
  }

  RED.nodes.registerType('linto-dictionary-continent', Node,
  {
    settings: {
      lintoDictionaryContinent: {
        value: {
          template: template.settupDictionaryTemplate(PALETTE_NODE_NAME),
          dataEntity: LintoDictionaryCoreNode.loadFile(__dirname, 'data/continent.md'),
          nameEntity : PALETTE_NODE_NAME
        },
        exportable: true
      }
    }
  })
}

class LintoDictionaryContinent extends LintoDictionaryCoreNode {
  constructor(RED, node, config) {
    super(RED, node, config)
  }
}
