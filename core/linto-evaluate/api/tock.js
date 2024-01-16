const debug = require('debug')(`linto:skill:v2:core:evaluate:tock`)

const tts = require('../data/tts')

module.exports = async function (msg) {
  const tts = this.tts[this.getFlowConfig('language').language]

  try {
    let text 
    if(msg.payload.transcript)
      text = msg.payload.transcript
    else if(msg.payload.text){
      text = msg.payload.text
    } else throw new Error('Evaluate input should containt a text')

    let options = prepareRequest.call(this, text)
    let requestResult = await this.request.post('http://' + this.config.evaluate.host + '/rest/nlp/parse', options)
    let wrappedData = wrapperTock(requestResult, this.config)

    msg.payload.nlu = wrappedData.nlu
    msg.data.confidence.nlu = { ...wrappedData.confidence.nlu }

    this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.emitter, msg)
  } catch (err) {
    this.sendEventError(msg, tts.say.unknown, { message: err.message, code: 500 })
    throw new Error(err)
  }
}

function prepareRequest(text) {
  let language = this.getFlowConfig('language').lang
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    body: {
      queries: [text],
      namespace: this.config.evaluate.namespace,
      applicationName: this.config.evaluate.applicationName,
      context: {
        language
      }
    },
    json: true
  }
  return options
}

function wrapperTock(nluData, config) {
  try {
    let output = { confidence: {} }
    const text = nluData.retainedQuery

    output.confidence.nlu = {
      useConfidenceScore: config.useConfidenceScore,
      confidenceThreshold: config.confidenceThreshold / 100,
      intentProbability: nluData.intentProbability,
      entitiesProbability: nluData.entitiesProbability
    }

    output.nlu = {
      intent: nluData.intent,
    }

    if (nluData.entities.length) {
      output.nlu.entitiesNumber = nluData.entities.length
    }
    output.nlu.entities = []

    for (const entity of nluData.entities) {
      let wrappedEntity = entity
      let textEntitie = text.substring(entity.start, entity.end)

      if (entity.entity.entityType.name === 'duckling:datetime') {
        wrappedEntity.duckling = entity.value.date
      }

      wrappedEntity.value = textEntitie
      wrappedEntity.entity = entity.entity.role
      output.nlu.entities.push(wrappedEntity)
    }

    return output
  } catch (err) {
    throw err
  }
}
