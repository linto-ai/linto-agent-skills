const debug = require('debug')('linto:skill:v2:core:linto-out')
const LintoCoreConnectNode = require('@linto-ai/linto-components').nodes.lintoCoreConnectNode
const { wireEvent } = require('@linto-ai/linto-components').components

const NODE_SUCCES_MESSAGE = 'Connected'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoTerminalOut(RED, this, config)
  }
  RED.nodes.registerType('linto-out', Node)
}

class LintoTerminalOut extends LintoCoreConnectNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireEvent = wireEvent.init(RED)

    this.init()
  }

  async init() {
    let mqttConfig = this.getFlowConfig('confMqtt')
    if (mqttConfig) {
      await this.mqtt.connect(mqttConfig)
      await this.configure()
    } else {
      this.sendStatus('yellow', 'ring', 'Configuration is missing')
    }
    this.wireEvent.subscribeCore.call(this, this.node.z, this.node.type, toLintoByEvent.bind(this))

    const coreNode = this
    this.node.on('close', (remove, done) => {
      coreNode.wireEvent.unsubscribe(`${this.node.z}-${this.node.type}`, true)
      done()
    })
  }
}

function toLintoByEvent(msg) {
  if (!msg.mqtt || !msg.mqtt.egress  || !msg.mqtt.egress === '') {
    this.sendStatus('yellow', 'ring', 'Unknown topic')
  } else {
    let output = { behavior: {  } }

    if(msg.data && msg.data.transcript)
      output.transcript = msg.data.transcript
    if(msg.payload && msg.payload.streaming)
      output.behavior.streaming = msg.payload.streaming
    if(msg.error)
      output.behavior.say = msg.error
    if(msg.payload && msg.payload.behavior)
      output.behavior = msg.payload.behavior

    let qos = 2
    if (msg.qos !== undefined)
      qos = msg.qos

    this.mqtt.publish(msg.mqtt.egress, JSON.stringify(output), qos)
    this.sendStatus('green', 'ring', NODE_SUCCES_MESSAGE)
  }
}
