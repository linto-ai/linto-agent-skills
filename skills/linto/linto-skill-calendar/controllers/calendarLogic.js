'use strict'

const debug = require('debug')('linto:skill:v2:linto-skill:calendar:controllers:calendar')
const moment = require('moment')

let entities = {
  prefix: "action",
  action_create: "action_create",
  action_delete: "action_delete",
  action_list: "action_list",
  visioconference: "visioconference",
  evenement: "evenement",
  datetime: "datetime"
}

let momentFormat

class SkillCalendar {
  constructor(openPaasJcal, lintoTTS, payloadAction) {
    this.openPaasJcal = openPaasJcal
    this.lintoTTS = lintoTTS
    this.payloadAction = payloadAction
    momentFormat = 'D MMMM [' + this.lintoTTS.say.at + '] H [' + this.lintoTTS.say.hours + '] m'
    moment.locale(lintoTTS.loadedLanguage)
  }

  actionCreate(payload) {
    let conversationData = payload.nlu

    // First step identify if it's visio-conference or evenement
    if (this.payloadAction.extractEntityFromPrefix(payload, entities.visioconference)) {
      conversationData.isVisio = true
    } else if (this.payloadAction.extractEntityFromPrefix(payload, entities.evenement)) {
      conversationData.isVisio = false
    } else {
      return {
        say: this.lintoTTS.error.missingTypeEvent
      }
    }

    return {
      ask: this.lintoTTS.say.title,
      conversationData
    }
  }

  async actionDelete() {
    let res = await this.openPaasJcal.deleteNext()
    if (!res) {
      return { say: this.lintoTTS.error.delete }
    } else if (res.status === 200) {
      return { say: this.lintoTTS.say.eventDelete }
    } else if (res.status === 404) {
      return { say: this.lintoTTS.say.noEventToDelete }
    } else if (res.status === 401) {
      return { say: this.lintoTTS.error.unauthorized }
    } else {
      return { say: this.lintoTTS.error.delete }
    }
  }

  async actionNext() {
    let res = await this.openPaasJcal.getNext()
    if (!res) {
      return { say: this.lintoTTS.error.nextEvent }
    } else if (res.status === 200) {
      res.body = JSON.parse(res.body)
      let eventDate = moment(res.body.start).format(momentFormat)
      return {
        say: this.lintoTTS.say.nextEvent + res.body.summary + ' '
          + this.lintoTTS.say.nextEventStart + eventDate
      }
    } else if (res.status === 404) {
      return { say: this.lintoTTS.say.noNextEvent }
    } else if (res.status === 401) {
      return { say: this.lintoTTS.error.unauthorized }
    } else {
      return { say: this.lintoTTS.error.nextEvent }
    }
  }

  sayIntent(payload) {
    let actionEntity = this.payloadAction.extractEntityFromPrefix(payload, entities.prefix)
    switch (true) {
      case (!actionEntity):
        return { say: this.lintoTTS.error.errorDataMissing }
      case (actionEntity.entity === entities.action_create):
        return this.actionCreate(payload)
      case (actionEntity.entity === entities.action_list):
        return this.actionNext()
      case (actionEntity.entity === entities.action_delete):
        return this.actionDelete()
      default:
        return { say: this.lintoTTS.error.errorDataMissing }
    }
  }

  async conversationCreate(payload) {
    let result = {
      conversationData: payload.conversationData
    }
    if (payload.transcript === '') {
      result.ask = this.lintoTTS.say.redo
      return result
    }

    if (!payload.conversationData.title) {
      // No location if it's a visioconference
      if (payload.conversationData.isVisio) {
        result.ask = this.lintoTTS.say.date
      } else {
        result.ask = this.lintoTTS.say.location
      }
      result.conversationData.title = payload.transcript

    } else if (!payload.conversationData.isVisio && !payload.conversationData.location) {
      result.ask = this.lintoTTS.say.date
      result.conversationData.location = payload.transcript

    } else if (!payload.conversationData.date) {
      result.ask = this.lintoTTS.say.attendee
      let entity = this.payloadAction.extractEntityFromPrefix(payload, entities.datetime)
      // If no datetime is find redo
      if (entity) {
        result.conversationData.date = entity.duckling
      } else {
        result.ask = this.lintoTTS.say.noDateDetected
      }
    } else {
      let entity = this.payloadAction.extractEntityFromPrefix(payload, entities.action_create)
      if (entity !== undefined) { // If entity create -> will create the event
        let res = await this.openPaasJcal.vcalCreateEvent(payload.conversationData)
        if (!res) {
          result.say = this.lintoTTS.error.create

        } else if (res.status === 201) {
          result.say = this.lintoTTS.say.create + ' ' + result.conversationData.title + ' , '
          if (result.conversationData.isVisio)
            result.say += this.lintoTTS.say.visioconference + ' , '
          else
            result.say += this.lintoTTS.say.at + result.conversationData.location + ' , '
          try {
            let date = result.conversationData.date.slice(0, -1)
            result.say += this.lintoTTS.say.resumeTime + moment(date).format(momentFormat)
          } catch (e) { }

        } else if (res.status === 401) {
          return { say: this.lintoTTS.error.unauthorized }
        } else {
          result.say = this.lintoTTS.error.create
        }
        result.conversationData = {}
      } else {
        let res = await this.openPaasJcal.searchPeople(payload.transcript)
        if (res.body.length === 0) {
          result.ask = this.lintoTTS.say.userNotFound + payload.transcript
            + this.lintoTTS.say.userNotFoundRedo
        } else {
          if (!payload.conversationData.attendee) {
            result.conversationData.attendee = [res.body[0].emailAddresses[0].value]
          } else {
            result.conversationData.attendee.push(res.body[0].emailAddresses[0].value)
          }
          result.ask = payload.transcript + ', ' + this.lintoTTS.say.invite
        }
      }
    }
    return result
  }

}
module.exports = SkillCalendar
