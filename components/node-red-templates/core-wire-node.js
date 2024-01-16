const debug = require('debug')('linto:linto-components:template:node:core-wire')
const fs = require('fs')

const CoreNode = require('./core-node')
const wireNode = require('../components/wire-node')

class LintoCoreWireNode extends CoreNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireNode = wireNode
  }
}

module.exports = LintoCoreWireNode
