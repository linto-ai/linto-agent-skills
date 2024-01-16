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
  utility = require('../utility')

describe('utility loadLanguage', () => {
  let outputText = '_loaded',
    pathTest = './test/data/',
    skillsTest = 'test'

  before(function() {
    process.env.DEFAULT_LANGUAGE = 'fr-FR'
  })

  it('it should load the language based on process.env', function() {
    let language = process.env.DEFAULT_LANGUAGE,
      loadedData = utility.loadLanguage(pathTest, skillsTest)
    assert.equal(loadedData, language + outputText)
  })

  it('it should load the language based on parameter', function() {
    let language = 'en-US',
      loadedData = utility.loadLanguage(pathTest, skillsTest, language)
    assert.equal(loadedData, language + outputText)
  })

  it('it should load the language based on parameter first', function() {
    process.env.DEFAULT_LANGUAGE = 'fr-FR'
    let language = 'en-US',
      loadedData = utility.loadLanguage(pathTest, skillsTest, language)
    assert.equal(loadedData, language + outputText)
  })


  it('it should throws if file don\'t exist', function() {
    let language = 'en-US'
    assert.throws(() => utility.loadLanguage(pathTest, 'error', language))
    assert.throws(() => utility.loadLanguage(pathTest, 'error'))
    assert.throws(() => utility.loadLanguage(pathTest, 'error', 'en-EN'))
  })

  it('it should throws when param is wrong', function() {
    assert.throws(() => utility.loadLanguage(20, skillsTest))
    assert.throws(() => utility.loadLanguage(undefined, skillsTest))
    assert.throws(() => utility.loadLanguage(pathTest, 20))
    assert.throws(() => utility.loadLanguage(pathTest, {}))
  })
})
