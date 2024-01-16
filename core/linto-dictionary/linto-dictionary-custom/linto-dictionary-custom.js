const debug = require('debug')('linto:skill:v2:core:dictionary')
const LintoDictionaryCoreNode = require('@linto-ai/linto-components').nodes.lintoDictionaryCoreNode
const { template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'custom'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)

    new LintoDictionaryCustom(RED, this, config)
  }

  RED.nodes.registerType('linto-dictionary-custom', Node,
  {
    settings: {
      lintoDictionaryCustom: {
        value: {
          template: template.settupDictionaryTemplate(PALETTE_NODE_NAME),
          dataEntity: "",
          nameEntity : ""
        },
        exportable: true
      }
    }
  })
}

class LintoDictionaryCustom extends LintoDictionaryCoreNode {
  constructor(RED, node, config) {
    super(RED, node, config)
  }
}
