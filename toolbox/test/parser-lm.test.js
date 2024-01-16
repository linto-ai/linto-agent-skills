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

const assert = require('assert'),
  ParserLm = require('../lib/parser/lmParser'),
  parser = new ParserLm(),

  appName = 'linto',
  filePath = process.cwd() + '/test/data/parser.md'

describe('parser lm', () => {
  it('it should contains the default structure data after a parse', async function() {
    await parser.process(filePath)
      .then((dataParsed) => {
        assert.ok(dataParsed)
        assert.equal(dataParsed.applicationName, appName)
        assert.ok(dataParsed.intent)
        assert.ok(dataParsed.intent.testNameIntent)
        assert.ok(dataParsed.intent.testNameIntent.en)
        assert.equal(dataParsed.intent.testNameIntent.en.length, 2)
        assert.ok(dataParsed.intent.testNameIntent.fr)
        assert.equal(dataParsed.intent.testNameIntent.fr.length, 3)
        assert.ok(dataParsed.intent.test)
        assert.ok(dataParsed.intent.test.en)
        assert.equal(dataParsed.intent.test.en.length, 3)
        assert.equal(dataParsed.intent.test.fr, undefined)

        assert.ok(dataParsed.entities)
        assert.ok(dataParsed.entities.acronyme)
        assert.ok(dataParsed.entities.acronyme.en)
        assert.equal(dataParsed.entities.acronyme.en.length, 2)
        assert.ok(dataParsed.entities.acronyme.fr)
        assert.equal(dataParsed.entities.acronyme.fr.length, 5)
      })
  })

  it('it should throw an error when file is not found', async function() {
    assert.throws(() => parser.process('fake/path'))
    assert.throws(() => parser.process(undefined))
  })
})
