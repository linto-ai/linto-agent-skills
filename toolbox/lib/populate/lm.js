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

const debug = require('debug')('utility:populate:lm')

const request = require('request'),
  fs = require('fs'),
  tempFs = require('fs-temp'),
  ParserLm = require('../parser/lmParser'),
  ERROR_CODE_ENTITY = 405,
  ERROR_CODE_MODEL = 404

class PopulateLm {
  constructor() {
    this.parser = new ParserLm()
  }

  async checkService(lmData) {
    var options = {
      method: 'GET',
      url: lmData.url + '/check'
    }

    return new Promise(async(resolve) => {
      request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body)
        } else {
          throw new Error(error)
        }
      })
    })
  }

  async inject(lmData, filePath) {
    await this.checkService(lmData)

    let modelArr = []
    this.parser.process(filePath)
      .then(async(json) => {
        try {
          for (let keyIntent in json.intent) {
            for (let langue in json.intent[keyIntent]) {
              let modelName = json.applicationName + '_' + langue,
                data = ''
              for (let index in json.intent[keyIntent][langue]) {
                data += json.intent[keyIntent][langue][index] + '\n'
              }
              let path = tempFs.writeFileSync(data),
                uri = lmData.url + '/model/' + modelName + '/intent/' + keyIntent,
                res = await this.makeRequest('POST', uri, path, true)
              if (res && res.statusCode === ERROR_CODE_ENTITY) {
                await this.makeRequest('PUT', uri, path, true)
              }
              if (modelArr.indexOf(modelName) === -1)
                modelArr.push(modelName)
            }
          }

          for (let keyEntities in json.entities) {
            for (let langue in json.entities[keyEntities]) {
              let modelName = json.applicationName + '_' + langue,
                data = ''
              for (let index in json.entities[keyEntities][langue]) {
                data += json.entities[keyEntities][langue][index] + '\n'
              }
              let path = tempFs.writeFileSync(data),
                uri = lmData.url + '/model/' + modelName + '/entity/' + keyEntities,
                res = await this.makeRequest('POST', uri, path, true)
              if (res && res.statusCode === ERROR_CODE_ENTITY) {
                await this.makeRequest('PATCH', uri, path, true)
              }
              if (modelArr.indexOf(modelName) === -1)
                modelArr.push(modelName)
            }
          }
        } catch (e) {
          debug('err', e)
        }
      })
      .then(async() => {
        try {
          for (let i in modelArr) {
            let uri = lmData.url + '/model/' + modelArr[i],
              res = await this.makeRequest('POST', uri, modelArr[i].split('_')[1], false)
            if (res && res.statusCode === ERROR_CODE_MODEL) {
              await this.makeRequest('GET', uri + '/rebuild', modelArr[i].split('_')[1], false)
            }
          }
        } catch (e) {
          debug('err', e)
        }
      })
  }

  async makeRequest(method, url, data, isPopulate) {
    var options = {
      method,
      url,
      headers: {}
    }

    if (isPopulate) {
      options.formData = {
        txtFile: fs.createReadStream(data, { encoding: 'utf-8' })
      }
    } else {
      options.formData = {
        acousticName: data
      }
    }

    return new Promise(async(resolve, reject) => {
      request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body)
        } else if (response.statusCode === ERROR_CODE_ENTITY && isPopulate) {
          resolve(response)
        } else if (response.statusCode === ERROR_CODE_MODEL && !isPopulate) {
          resolve(response)
        } else {
          if (isPopulate)
            resolve()
          else
            reject(error)
        }
      })
    })
  }
}

module.exports = PopulateLm
