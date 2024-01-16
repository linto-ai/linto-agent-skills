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

const debug = require('debug')('utility:populate:nlu')

const request = require('request'),
  fs = require('fs'),
  tempFs = require('fs-temp'),
  ParserNlu = require('../parser/nluParser'),
  uriGetApplication = '/rest/admin/dump/sentences/'

class PopulateNlu {
  constructor() {
    this.parser = new ParserNlu()
  }

  inject(tockData, filePath) {
    this.parser.process(filePath)
      .then((parsedJson) => {
        let path = tempFs.writeFileSync(Buffer.from(JSON.stringify(parsedJson)))
        this.getRequest('POST', tockData, path)
      })
  }

  getRequest(method, tockConfig, filePath) {
    let url = tockConfig.url + uriGetApplication
    var options = {
      followAllRedirects: true,
      method,
      url,
      headers: {
        authorization: tockConfig.authToken
      }
    }

    if (filePath)
      options.formData = {
        data: fs.createReadStream(filePath)
      }

    request(options, function(error, response, body) {
      if (error) throw new Error(error)
      debug(body)
    })
  }
}
module.exports = PopulateNlu
