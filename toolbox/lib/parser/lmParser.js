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

const debug = require('debug')('utility:parser:lm:linstt')
const fs = require('fs'),
  readline = require('readline'),

  REGEX_WORD = new RegExp('\\[(.*?)\\]'),
  REGEX_ENTITY = new RegExp('\\((.*?)\\)'),
  SEPARATOR = '##',
  APPLICATION_SEPARATOR = '##application',
  INTENT_SEPARATOR = '##intent',
  ENTITIE_SEPARATOR = '##entitie'

class LmParser {
  constructor() {
    return this
  }

  process(pathFile) {
    if (!pathFile || !fs.existsSync(pathFile)) {
      throw new Error('File not found to parse')
    }

    let output = {
        intent: {},
        entities: {}
      },
      isIntent = false, key, language

    return new Promise((resolve, reject) => {
      try {
        readline.createInterface({
          input: fs.createReadStream(pathFile)
        }).on('line', function(line) {
          if (line.indexOf(SEPARATOR) > -1) {
            key = line.split('|')[1]
            language = line.split('|')[2]
            if (line.indexOf(INTENT_SEPARATOR) > -1) {
              isIntent = true
              if (!output.intent[key])
                output.intent[key] = []
              if (!output.intent[key][language])
                output.intent[key][language] = []
            } else if (line.indexOf(ENTITIE_SEPARATOR) > -1) {
              isIntent = false
              if (!output.entities[key])
                output.entities[key] = []
              if (!output.entities[key][language])
                output.entities[key][language] = []
            } else if (line.indexOf(APPLICATION_SEPARATOR) > -1) {
              output.applicationName = key
            }
          } else if (line.length !== 0) {
            if (isIntent) {
              output = manageIntent(line, output, key, language)
            } else {
              output = manageEntitie(line, output, key, language)
            }
          }
        }).on('close', () => {
          resolve(output)
        })
      } catch (err){
        reject(err)
      }
    })
  }
}

// Add entitie if no duplicate
let manageEntitie = function(line, output, entitieKey, language) {
    line = line.replace('- ', '')
    if (!output.entities[entitieKey][language].includes(line))
      output.entities[entitieKey][language].push(line)
    return output
  },

  manageIntent = function(line, output, intentKey, language) {
    line = line.replace('- ', '')
    let text = line
    for (let i = 0; i < (line.split('](').length - 1); i++) {
      let word = text.match(REGEX_WORD),
        entity = text.match(REGEX_ENTITY)
      text = text.replace(word[0] + entity[0], '#' + entity[1])

      // Create key entitie if don't exist
      if (!output.entities[entity[1]])
        output.entities[entity[1]] = []
      if (!output.entities[entity[1]][language])
        output.entities[entity[1]][language] = []

      // Add entitie if no duplicate
      if (!output.entities[entity[1]][language].includes(word[1]))
        output.entities[entity[1]][language].push(word[1])
    }

    // Add command to intent if no duplicate
    if (!output.intent[intentKey][language].includes(text))
      output.intent[intentKey][language].push(text)

    return output
  }

module.exports = LmParser
