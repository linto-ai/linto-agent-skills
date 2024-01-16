/*
 * Copyright (c) 2018 Linagora.
 *
 * This file is part of Linto-Utility
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict'

const PopulateSkills = require('./lib/populate'),
  WordsToNumber = require('./lib/wordsToNumber')

class Utility {
  constructor() {
    this.populate = PopulateSkills
    this.wordsToNum = WordsToNumber
  }

  /**
     * @summary a text that will be say by linto
     *
     * @param {string} toSay string that linto gonna say
     *
     * @returns {Object} format json that linto gonna read to saying stuff
     */
  formatToSay(toSay) {
    if (typeof toSay !== 'string')
      throw new Error('toSay is require for linto output')
    return {
      behavior: toSay
    }
  }

  /**
     * @summary a text that will be ask by linto
     *
     * @param {string} toAsk string that linto gonna say
     * @param {Objet} data data to send at linto
     *
     * @returns {Object} format json that linto gonna read to asking stuff
     */
  formatToAsk(toAsk, data) {
    if (typeof toAsk !== 'string')
      throw new Error('toAsk is require for linto output')
    if (!data)
      throw new Error('data can\'t be empty')
    return {
      ask: toAsk,
      conversationData: data
    }
  }

  /**
     * @summary Load the json file for language
     *
     * @param {string} filepath the path of the current skills location
     * @param {string} nodeName the node name
     * @param {string} language language selected by the RED flow
     *
     * @returns {object} language json
     **/
  loadLanguage(filepath, nodeName, language) {
    if (!language)
      language = process.env.DEFAULT_LANGUAGE

    if (!filepath || !nodeName || typeof filepath !== 'string' || typeof nodeName !== 'string')
      throw new Error('parameter should be a string')


    filepath = filepath.slice(0, filepath.lastIndexOf('/'))
    return require(filepath + '/locales/' + language + '/' + nodeName)[nodeName].response
  }

  /**
     * @summaryWords to generate into number
     *
     * @param {string} words words to translate
     * @param {string} language language selected by the RED flow
     *
     * @returns {int} integer number of the words
     **/
  wordsToNumber(words, language) {
    return this.wordsToNum.wordsToNumber(words, language)
  }

  /**
     * @summary Check if the input from linto match the skills to execute
     *
     * @param {Object} payload the input message payload receive from the flow
     * @param {string} intent the intent keys of the current skills
     * @param {boolean} isConversationalSkill is it a conversational skills or not
     *
     * @returns {Object.isIntent} do the skill will need to be executed
     * @returns {Object.isConversational} do the skill will execute the conversational part
     **/
  intentDetection(payload, intent, isConversationalSkill = false) {
    if (!payload || !intent)
      throw new Error('required parameter are missing for detect the intent')

    let output = {
      isIntent: false,
      isConversational: false
    }
    if (isConversationalSkill && !!payload.conversationData
      && Object.keys(payload.conversationData).length !== 0
      && payload.conversationData.intent === intent) {
      output.isIntent = true
      output.isConversational = true
    } else if ((!!payload.conversationData && Object.keys(payload.conversationData).length === 0)
      && payload.nlu.intent === intent) {
      output.isIntent = true
      output.isConversational = false
    }
    return output
  }

  /**
     * @summary Check if the input from linto match the multiple intent skills to execute
     *
     * @param {Object} payload the input message payload receive from the flow
     * @param {Objects} intents A json with all key has intent
     * @param {boolean} isConversationalSkill is it a conversational skills or not
     *
     * @returns {Object.isIntent} do the skill will need to be executed
     * @returns {Object.isConversational} do the skill will execute the conversational part
     * @returns {Object.skill} the name of the skill to execute
     **/
  multipleIntentDetection(payload, intents, isConversationalSkill = false) {
    let output = {
      isIntent: false,
      isConversational: false
    }
    if (isConversationalSkill && !!payload.conversationData
      && Object.keys(payload.conversationData).length !== 0
      && intents.hasOwnProperty(payload.conversationData.intent)) {
      output.isIntent = true
      output.isConversational = true
      output.skill = payload.conversationData.intent
    } else if ((!!payload.conversationData && Object.keys(payload.conversationData).length === 0)
      && intents.hasOwnProperty(payload.nlu.intent)) {
      output.isIntent = true
      output.isConversational = false
      output.skill = payload.nlu.intent
    }
    return output
  }

  /**
     * @summary Extract the first entities by prefix
     *
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     *
     * @returns {Object} The entities found or nothing
     **/
  extractEntityFromPrefix(payload, prefix) {
    for (let entity of payload.nlu.entities) {
      if (entity.entity.includes(prefix)) {
        return entity
      }
    }
    return
  }

  /**
     * @summary Extract the first entities by entitiesname
     *
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     *
     * @returns {Object} The entities found or nothing
     **/
  extractEntityFromType(payload, entityName) {
    for (let entity of payload.nlu.entities) {
      if (entity.entity === entityName) {
        return entity
      }
    }
    return
  }

  /**
     * @summary Check if all require data is in the payload message
     *
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     *
     * @returns {Boolean} Give the information if all entities is here
     **/
  checkEntitiesRequire(payload, requireArrayEntities = []) {
    if (payload.nlu.entitiesNumber === requireArrayEntities.length) {
      for (let entity of payload.nlu.entities) {
        if (requireArrayEntities.indexOf(entity.entity) === -1)
          return false
      }
      return true
    }
    return false
  }

  /**
     * @summary Add the data to the NLU
     *
     * @param {Object} tockConfig configuration about the tock data given by linto-admin, contains user, password and url
     * @param {String} skillsDataPath the path file to upload file
     *
     * @returns {Boolean} the result status of the NLU (Natural Language Understanding) injection
     **/
  populateNluSkills(tockConfig, skillsDataPath) {
    if (tockConfig.url && tockConfig.authToken)
      this.populate.injectNlu(tockConfig, skillsDataPath)
  }

  /**
     * @summary Add the data to the LM
     *
     * @param {Object} lmConfig configuration about the tock data given by linto-admin, contains user, password and url
     * @param {String} skillsDataPath the path file to upload file
     *
     * @returns {Boolean} the result status of the LM (Language Model) injection
     **/
  populateLmSkills(lmConfig, skillsDataPath) {
    if (lmConfig.url)
      this.populate.injectLm(lmConfig, skillsDataPath)
  }

  /**
     * @summary Add the data to the LM
     *
     * @param {Object} config configuration about the lm and nlu (see populate above)
     * @param {Object} skillsPath json containing lm and nlu data file path
     *
     * @returns {Boolean} the result status of the LM (Language Model) injection
     **/
  populate(config, skillsPath){
    this.populateLmSkills(config.lmConfig, skillsPath.lm)
    this.populateNluSkills(config.nluConfig, skillsPath.nlu)
  }
}

module.exports = new Utility()
