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

describe('utility formatToSay', () => {
  it('it should say something', function() {
    let text = 'my text',
      payload = utility.formatToSay(text)
    assert.equal(typeof payload, 'object')
    assert.equal(typeof payload.behavior, 'string')
    assert.equal(payload.behavior, text)
  })

  it('it should throws when param is wrong', function() {
    assert.throws(() => utility.formatToSay())
    assert.throws(() => utility.formatToSay(20))
    assert.throws(() => utility.formatToSay({}))
    assert.throws(() => utility.formatToSay(undefined))
  })
})

describe('utility formatToAsk', () => {
  it('it should ask something', function() {
    let text = 'my text',
      data = {},
      payload = utility.formatToAsk(text, data)
    assert.equal(typeof payload, 'object')
    assert.equal(typeof payload.ask, 'string')

    assert.equal(payload.ask, text)
    assert.equal(payload.conversationData, data)
  })

  it('it should throws when param is wrong', function() {
    assert.throws(() => utility.formatToAsk())
    assert.throws(() => utility.formatToAsk('text'))
    assert.throws(() => utility.formatToAsk(undefined, {}))
    assert.throws(() => utility.formatToAsk(20, {}))
  })
})
