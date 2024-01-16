const debug = require('debug')('linto:skill:v2:core:dictionary')
const LintoDictionaryCoreNode = require('@linto-ai/linto-components').nodes.lintoDictionaryCoreNode
const { template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'fr-department'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)

    new LintoDictionaryFrenchDepartment(RED, this, config)
  }

  RED.nodes.registerType('linto-dictionary-french-department', Node,
  {
    settings: {
      lintoDictionaryFrenchDepartment: {
        value: {
          template: template.settupDictionaryTemplate(PALETTE_NODE_NAME),
          dataEntity: LintoDictionaryCoreNode.loadFile(__dirname, 'data/french_department.md'),
          nameEntity : PALETTE_NODE_NAME
        },
        exportable: true
      }
    }
  })
}

class LintoDictionaryFrenchDepartment extends LintoDictionaryCoreNode {
  constructor(RED, node, config) {
    super(RED, node, config)
  }
}
