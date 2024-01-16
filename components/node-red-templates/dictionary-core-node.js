const debug = require('debug')('linto:linto-components:template:node:dictionary-core')
const CoreNode = require('./core-node')
const dictionaryNodeLabel = require('../data/label').nodeRedTemplates.dictionaryCoreNode

class DictionaryCoreNode extends CoreNode {
  constructor(RED, node, config) {
    super(node, config)
    RED.library.register("dictionaries")

    if (!config.name) this.sendStatus('yellow', 'ring', dictionaryNodeLabel.nameRequire)
    else if (!config.data) this.sendStatus('yellow', 'ring', dictionaryNodeLabel.dataRequire)
    else this.cleanStatus()
  }
}

module.exports = DictionaryCoreNode