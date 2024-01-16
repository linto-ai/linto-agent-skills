const debug = require('debug')(`linto:skill:v2:core:evaluate:rasa`)

module.exports = function (payload) {
  let options = prepareRequest.call(this, payload)
  let requestResult = await this.request.post(this.config.evaluate.host, options)
  let wrappedData = wrapper(requestResult)
  debug(`Not yet implemented`)
  return { payload: wrappedData }
}

function prepareRequest(msg) {
  let language = this.getFlowConfig('language').reduce

  let options = {
    headers: {
      'content-type': 'application/json'
    },
    body: {
      queries: [msg.payload.transcript],
      context: {
        language
      }
    },
    json: true
  }

  return options
}

function wrapper(nluData) {
  let wrapper = {}
  wrapper.intent = nluData.intent.name
  if (nluData.entities.length)
    wrapper.entitiesNumber = nluData.entities.length
  wrapper.entities = nluData.entities
  return wrapper
}