const debug = require('debug')('linto:skill:v2:core:linto-red-event-emitter')
const LintoCoreEventNode = require('@linto-ai/linto-components').nodes.lintoCoreEventNode

const tts = require('./data/tts')

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoRedEventEmitter(RED, this, config)
  }
  RED.nodes.registerType('linto-red-event-emitter', Node)
}


class LintoRedEventEmitter extends LintoCoreEventNode {
  constructor(RED, node, config) {
    super(RED, node, config)

    this.config = {
      ...config,
      chatbot: { ...this.getFlowConfig('configChatbot') }
    }

    this.subscribeFunctionToEvent(this.node.z, this.wireEvent.eventData.core.emitter, emitToSkills)
  }
}

function emitToSkills(msg) {
  let toEmit = msg.payload.nlu.intent
  let conversationData = undefined
  msg.payload.isConversational = false

  if (!!msg.payload.conversationData && Object.keys(msg.payload.conversationData).length !== 0 && !!msg.payload.conversationData.intent) {
    toEmit = msg.payload.conversationData.intent
    msg.payload.nlu.intent = toEmit
    conversationData = msg.payload.conversationData
    delete msg.payload['conversationData']
    msg.payload.isConversational = true
  }

  if ((msg.data.confidence.stt.useConfidenceScore && msg.data.confidence.stt.confidenceScore <= msg.data.confidence.stt.confidenceThreshold)
    || (msg.data.confidence.nlu.useConfidenceScore && msg.data.confidence.nlu.intentProbability <= msg.data.confidence.nlu.confidenceThreshold)) {
      toEmit = this.wireEvent.eventData.core.out
      msg.payload.behavior = { say: tts[this.getFlowConfig('language').language].say.lowConfidence }
    if (conversationData) msg.payload.conversationData = conversationData
  }

  //Skill not in flow
  if (!this.wireEvent.isEventInFlow(`${this.wireEvent.getBaseName()}-${this.node.z}-${toEmit}`)) {
    if(this.config.chatbot && this.config.chatbot.host && this.config.chatbot.rest
        && msg.data.confidence.nlu.useConfidenceScore){
      this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.chatbot, msg)
    }else{
      toEmit = this.wireEvent.eventData.core.out
      msg.payload.behavior = { say: tts[this.getFlowConfig('language').language].say.unknown }
      this.wireEvent.notifyOut(this.node.z, msg)
    }
  }else
    if(this.config.chatbot && this.config.chatbot.host && this.config.chatbot.rest &&
      (msg.data.confidence.nlu.useConfidenceScore && msg.data.confidence.nlu.intentProbability <= msg.data.confidence.nlu.confidenceThreshold)){
      this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.chatbot, msg)
    }else {
      this.wireEvent.notifySkill(this.node.z, toEmit, msg)
    }
}