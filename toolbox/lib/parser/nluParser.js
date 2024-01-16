/*
 * Copyright (c) 2017 Linagora.
 *
 * This file is part of Business-Logic-Server
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

const debug = require('debug')('parser:rasa:to:tock')
const fs = require('fs'),
  readline = require('readline'),

  REGEX_WORD = new RegExp('\\[(.*?)\\]'),
  REGEX_ENTITY = new RegExp('\\((.*?)\\)'),
  DEFAULT_LANGUAGE = 'fr',

  PREFIX = 'app:',
  INTENT_SEPARATOR = '##intent',
  ENTITIE_SEPARATOR = '##entitie',
  APPLICATION_SEPARATOR = '##application'


class NluParser {
  constructor() {
    return this
  }

  process(pathFile) {
    if (!pathFile || !fs.existsSync(pathFile)) {
      throw new Error('File not found to parse')
    }

    let intent, language, entitieKey, isIntent = false,
      isEntitie = false, entities = {},
      output = {
        sentences: []
      }

    return new Promise(async(resolve, reject) => {
      try {
        readline.createInterface({
          input: fs.createReadStream(pathFile)
        }).on('line', function(line) {
          if (line.indexOf(APPLICATION_SEPARATOR) > -1) {
            output.applicationName = PREFIX + line.split('|')[1]
          } else if (line.indexOf(INTENT_SEPARATOR) > -1) {
            intent = PREFIX + line.split('|')[1]
            language = line.split('|')[2]
            isIntent = true
            isEntitie = false
          } else if (line.indexOf(ENTITIE_SEPARATOR) > -1) {
            entitieKey = line.split('|')[1]
            language = line.split('|')[2]
            isEntitie = true
            isIntent = false
          } else if (line.length !== 0) {
            if (isIntent) {
              let mySentence = manageIntent(line, intent, language)
              output.sentences.push(mySentence)
            } else if (isEntitie) {
              entities = manageEntitie(line, entitieKey, entities, language)
            }
          }
        }).on('close', () => {
          if (output.sentences.length !== 0)
            output = mergeData(output, entities)
          resolve(output)
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

let mergeData = function(inputSentences, entitiesList) {
    if (Object.keys(entitiesList).length === 0)
      return inputSentences

    let output = inputSentences
    inputSentences.sentences.forEach(function(sentence) {
      if (entitiesList[sentence.language]) {
        let keysList = Object.keys(entitiesList[sentence.language])
        sentence.entities.forEach(function(sentenceEntitie) {
          if (keysList.includes(sentenceEntitie.role)) {
            entitiesList[sentence.language][sentenceEntitie.role].forEach(function(entitieValue) {
              let mdMatchRegex = new RegExp('\\[([^\\]]+)]\\((' + sentenceEntitie.role + ')(\\))'),
                newValue = '[' + entitieValue + '](' + sentenceEntitie.role + ')',
                newLine = sentence.origin.replace(mdMatchRegex, newValue),
                mySentence = manageIntent(newLine, sentence.intent, sentence.language)
              output.sentences.push(mySentence)
            })
          }
        })
      }
    })
    return output
  },

  manageEntitie = function(line, entitieKey, entities, language = DEFAULT_LANGUAGE) {
    line = line.replace('- ', '')
    if (!entities[language]) {
      entities[language] = {}
    }
    if (!entities[language][entitieKey])
      entities[language][entitieKey] = []
    entities[language][entitieKey].push(line)

    return entities
  },

  manageIntent = function(line, intent, language = DEFAULT_LANGUAGE) {
    line = line.replace('- ', '')
    let mySentence = {
        intent,
        entities: [],
        language
      },

      text = line
    for (let i = 0; i < (line.split('](').length - 1); i++) {
      let word = text.match(REGEX_WORD),
        entity = text.match(REGEX_ENTITY)
      mySentence.entities.push({
        entity: PREFIX + entity[1],
        role: entity[1],
        subEntities: [],
        start: word.index,
        end: word.index + word[1].length
      })

      text = text.replace(word[0] + entity[0], word[1])
    }
    mySentence.text = text
    mySentence.origin = line
    return mySentence
  }

module.exports = NluParser
