const debug = require('debug')('linto:skill:v2:core:linto-on-connect')
const LintoCoreConnectNode = require('@linto-ai/linto-components').nodes.lintoCoreConnectNode
const { mqtt } = require('@linto-ai/linto-components').connect
const { redAction } = require('@linto-ai/linto-components').components

const TOPIC_STATUSACK = 'statusack'
const TOPIC_STATUS = 'status'


module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoOnConnect(RED, this, config)
  }
  RED.nodes.registerType('linto-on-connect', Node)
}

class LintoOnConnect extends LintoCoreConnectNode {
  constructor(RED, node, config) {
    super(node, config)

    this.init(RED)
  }

  async init(RED) {
    let serialNumber = redAction.getLintoSnFromFlow.call(RED, this.node.z)
    let mqttConfig = this.getFlowConfig('confMqtt')

    if (!serialNumber.length) {
      this.sendStatus('yellow', 'ring', 'Linto application-in or terminal-in is require')
    } else if (mqttConfig) {
      await this.mqtt.connect(mqttConfig)

      this.mqtt.subscribeToLinto(mqttConfig.toLinto, serialNumber, TOPIC_STATUSACK)
      this.mqtt.onMessage(mqttHandler.bind(this), TOPIC_STATUSACK) // get linto info from flow

      this.mqtt.subscribeToLinto(mqttConfig.fromLinto, serialNumber, TOPIC_STATUS)
      this.mqtt.onMessage(onLintoConnect.bind(this), TOPIC_STATUS) // send info from flow to linto (language)

      this.cleanStatus()
      await this.configure()
    } else {
      this.sendStatus('yellow', 'ring', 'Configuration is missing')
    }
  }
}

function onLintoConnect(topic, payload) {
  let language = this.getFlowConfig('language').language
  topic = topic.split('/')

  this.mqtt.publish(`${topic[0]}/tolinto/${topic[2]}/tts_lang`, `{"value":"${language}"}`)
}

function mqttHandler(topic, payload) {
  if (typeof payload === 'object') {
    try {
      let json = JSON.parse(payload)
      debug(`Updated linto : ${topic}`)
      for (let key in json) {
        this.setFlowConfig(key, json[key])
        debug(`Update ${key} with ${json[key]}`)
      }
    } catch (err) {
      this.sendStatus('red', 'ring', 'On connect require a json')
      console.error(err)
    }
  } else {
    this.sendStatus('red', 'ring', 'On connect require a json')
  }

}
