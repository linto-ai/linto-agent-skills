const debug = require('debug')('linto:linto-components:template:node:core')
const fs = require('fs')

const Node = require('./node')
const nodeType = require('../data/type-node')

class LintoCoreNode extends Node {
  constructor(node, config) {
    super(node, config)
    this.nodeType = nodeType.CORE
  }

  sendEventError(msg, error) {
    if (this.wireEvent) {
      this.wireEvent.notifyOut(this.node.z, {
        mqtt : msg.mqtt,
        payload : msg.payload,
        error : error
      })
    }else console.log('wire event is not define for this node')
  }

  sendToLinto(msg) {
    if (this.wireEvent) {
      this.wireEvent.notifyOut(this.node.z, {
        mqtt : msg.mqtt,
        payload : msg.payload
      })
    } else console.log('wire event is not define for this node')
  }

  async loadModule(modulePath) {
    if (fs.existsSync(`${modulePath}.js`)) {
      return require(modulePath)
    }
    return undefined
  }

  sendPayloadToLinTO(topic, payload, qos = 2) {
    if (this.wireEvent) {
      this.wireEvent.notifyOut(this.node.z, {
        mqtt : { egress : topic },
        payload,
        qos
      })
    } else {
      console.log('wire event is not define for connect-core-node')
    }
  }
}

module.exports = LintoCoreNode