const debug = require('debug')('linto:skill:v2:core:linto-application-in')
const LintoCoreConnectNode = require('@linto-ai/linto-components').nodes.lintoCoreConnectNode
const { wireEvent, wireNode } = require('@linto-ai/linto-components').components
const tts = require('./data/tts')

const TOPIC_SUBSCRIBE = '#'
const TOPIC_FILTER = ['nlp', 'streaming', 'chatbot', 'skills']

const DEFAULT_TOPIC = '+'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoApplicationIn(RED, this, config)
  }
  RED.nodes.registerType('linto-application-in', Node)
}

class LintoApplicationIn extends LintoCoreConnectNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireEvent = wireEvent.init(RED)
    this.wireNode = wireNode
    this.tts = tts

    this.init()
  }

  async init() {
    await this.autoloadTopic(__dirname + '/topic')
    await this.configure()

    let mqttConfig = this.getFlowConfig('confMqtt')
    if (mqttConfig) {
      let res = await this.mqtt.connect(mqttConfig)

      this.mqtt.subscribeToLinto(mqttConfig.fromLinto, DEFAULT_TOPIC, TOPIC_SUBSCRIBE)
      this.mqtt.onMessage(mqttHandler.bind(this), TOPIC_FILTER)
    } else this.sendStatus('yellow', 'ring', 'Configuration is missing')
  }
}

async function mqttHandler(topic, payload) {
  const [_clientCode, _channel, _sn, _etat, _type, _id] = topic.split('/')
  switch (_etat) {
    case 'nlp':
      this.topicHandler.nlp.call(this, topic, payload)
      break
    case 'streaming':
      this.topicHandler.lvcsrstreaming.call(this, topic, payload)
      break
    case 'chatbot':      // For chatbot _type = _id
      this.topicHandler.chatbot.call(this, topic, payload)
      break
    case 'skills':  // For skills, _type = _skill_name
      this.topicHandler.skills.call(this, topic, payload)
      break
    default:
      const outTopic = `${_clientCode}/tolinto/${_sn}/streaming/${_id}`
      this.notifyEventError(outTopic, text.say.streaming_not_started, 'User need to start a streaming process')

      console.error('No data to store message')
      break
  }
}