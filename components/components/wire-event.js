const debug = require('debug')('linto:linto-components:components:wire-event')

const { WireEventHandlerException } = require('../exception/wire')

const eventData = require('../data/skill-event')

class WireEvent {
  constructor(z) {
    this.eventBaseName = eventData.basename
    this.eventOutputName = eventData.out
    this.eventData = eventData
    this.eventRegister = []
  }

  init(RED) {
    this.redEvents = RED.events
    return this
  }

  getBaseName() {
    return this.eventBaseName
  }

  getOutputName() {
    return this.eventOutputName
  }

  getCoreName() {
    return this.eventData.corename
  }

  getLintoOut(nodeZ){
    return `${eventData.basename}-${eventData.corename}-${nodeZ}-${eventData.out}`
  }


  /* Require to be called with call */
  subscribe(flowId, eventName, eventOutput, handler, isSkill = false){
    // const node = this
    debug(`Create event : ${eventData.basename}-${eventName}`)
    const node = this
    
    if(node.wireEvent === undefined){
      node.sendStatus('red', 'ring', 'Component WireEvent is not declared')
      throw new WireEventHandlerException('Component wireEvent is not declared')
    }else {
      node.wireEvent.redEvents.on(`${eventData.basename}-${eventName}`, async (...args) => {
        try {
          node.sendStatus('green', 'ring')
          let result = await handler(...args)
          if (isSkill) {
            args[0].payload.behavior = result

            node.wireEvent.notify(`${eventOutput}`, args[0])
          }

          setTimeout(function () {
            node.cleanStatus()
          }, node.statusTimer);

        } catch (err) {
          err = new WireEventHandlerException(err).message
          const error = {
            topic : args[0].payload.topic,
            error : err.message
          }

          node.sendStatus('red', 'ring', error.message)
          node.wireEvent.notifyOut(flowId, error)
          throw error
        }
      })
    }
  }

  /* Require to be called with call */
  subscribeSkill(flowId, eventName, handler, isAction = false){
    if(isAction) eventName = eventData.skill.action + '-' + eventName

    const idEventName = `${flowId}-${eventName}`
    const idOutput = `${eventData.corename}-${flowId}-${eventData.out}`
    this.wireEvent.subscribe.call(this, flowId, idEventName, idOutput, handler, true)
  }

  /* Require to be called with call */
  subscribeCore(flowId, eventName, handler){
    const idEventName = `${eventData.corename}-${flowId}-${eventName}`
    const idOutput = `${eventData.corename}-${flowId}-${eventData.out}`
    this.wireEvent.subscribe.call(this, flowId, idEventName, idOutput, handler, false)
  }

  notify(eventName, ...args) {
    const eventToTrigger = `${eventData.basename}-${eventName}`
    // debug('notify '+ eventToTrigger)

    if(this.isEventInFlow(eventToTrigger)) this.redEvents.emit(eventToTrigger, ...args)
    else debug('Event not found ' + eventToTrigger)
  }

  notifySkill(flowId, eventName, ...args) {
    const eventToTrigger = `${eventData.basename}-${flowId}-${eventName}`
    // debug('notify skill '+ eventToTrigger)

    if(this.isEventInFlow(eventToTrigger)) this.redEvents.emit(eventToTrigger, ...args)
    else this.notifyError(flowId, eventName, ...args)
  }

  notifyAction(flowId, eventName, ...args) {
    const eventToTrigger = `${eventData.basename}-${flowId}-${eventData.skill.action}-${eventName}`
    // debug('notify action '+ eventToTrigger)

    if(this.isEventInFlow(eventToTrigger)) this.redEvents.emit(eventToTrigger, ...args)
    else this.notifyError(flowId, eventName, ...args)
  }

  notifyCore(flowId, eventName, ...args) {
    const eventToTrigger = `${eventData.basename}-${eventData.corename}-${flowId}-${eventName}`
    // debug('notify core '+ eventToTrigger)

    if(this.isEventInFlow(eventToTrigger)) this.redEvents.emit(eventToTrigger, ...args)
    else this.notifyError(flowId, eventName, ...args)
  }

  notifyOut(flowId, ...args){
    // debug(`Notify out ${eventData.basename}-${eventData.corename}-${flowId}-${eventData.out}`)
    this.redEvents.emit(`${eventData.basename}-${eventData.corename}-${flowId}-${eventData.out}`, ...args)
  }

  notifyError(flowId, eventName,...args){
    this.notifyOut(flowId, {
      mqtt : args[0].mqtt,
      error : `Desired event not found : ${eventName}`
    })
  }

  // update all subscribed objects / DOM elements
  // and pass some data to each of them
  unsubscribe(eventName, isCore = false) {
    if (!eventName) return
    if(isCore)
      this.redEvents.removeAllListeners(`${eventData.basename}-${eventData.corename}-${eventName}`)
    else
      this.redEvents.removeAllListeners(`${eventData.basename}-${eventName}`)
  }

  isEventInFlow(eventName){
    let result = Object.keys(this.redEvents._events).filter(name => name === eventName)

    if (result.length === 0) return false
    return true
  }
}

module.exports = new WireEvent()