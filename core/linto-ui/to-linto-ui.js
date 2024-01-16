const debug = require('debug')('linto:skill:v2:core:to-linto-ui')
const LintoCoreNode = require('@linto-ai/linto-components').nodes.lintoCoreNode
const { wireEvent } = require('@linto-ai/linto-components').components

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new ToLintoUi(RED, this, config)
  }
  RED.nodes.registerType('to-linto-ui', Node)
}

class ToLintoUi extends LintoCoreNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireEvent = wireEvent.init(RED)
    this.init()
  }

  async init() {
    this.wireEvent.subscribeWithStatus.call(this, this.node.z, this.node.type, toUiLinto.bind(this))
    this.node.on('close', (remove, done) => {
      this.wireEvent.unsubscribe(`${this.node.z}-${this.node.type}`)
      done()
    })
  }
}

function toUiLinto(msg) {
  if (msg) {
    this.wireNode.nodeSend(this.node, msg)
  }
}