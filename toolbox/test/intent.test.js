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
  utility = require('../utility'),

  intentKey = {
    test: 'test',
    isConversational: 'isConversational',
    isFake: 'isFake'
  }
describe('utility multipleIntentDetection', () => {
  const intentConv_payload = {
    transcript: 'créer moi un memo pour allez a vegas',
    confidence: '0.5',
    nlu: {
      intent: 'isConversational'
    },
    conversationData: {
      intent: 'isConversational'
    }
  }

  it('it should detect a conversational intent', function() {
    let skillSearch = 'isConversational'
    const intentDetection = utility.multipleIntentDetection(intentConv_payload, intentKey, true)
    assert.ok(intentDetection.isIntent)
    assert.ok(intentDetection.isConversational)
    assert.equal(intentDetection.skill, skillSearch)
  })

  it('it should detect an intent', function() {
    let skillSearch = 'isConversational',
      new_intentConv_payload = intentConv_payload
    new_intentConv_payload.conversationData = {}

    const intentDetection = utility.multipleIntentDetection(new_intentConv_payload, intentKey, true)
    assert.ok(intentDetection.isIntent)
    assert.equal(intentDetection.isConversational, false)
    assert.equal(intentDetection.skill, skillSearch)
  })

  it('it should not detect any intent', function() {
    let fakeIntent = {
      fake: 'fake'
    }
    const intentDetectConv = utility.multipleIntentDetection(intentConv_payload, fakeIntent, true)
    assert.equal(intentDetectConv.isIntent, false)
    assert.equal(intentDetectConv.isConversational, false)

    const intentDetection = utility.multipleIntentDetection(intentConv_payload, fakeIntent)
    assert.equal(intentDetection.isIntent, false)
    assert.equal(intentDetection.isConversational, false)
  })

  it('it should throws an execption if require parameter missing', function() {
    assert.throws(() => utility.multipleIntentDetection(undefined, intentKey, true))
    assert.throws(() => utility.multipleIntentDetection(undefined, intentKey))
    assert.throws(() => utility.multipleIntentDetection(intentConv_payload, undefined, true))
    assert.throws(() => utility.multipleIntentDetection(intentConv_payload, undefined))
    assert.throws(() => utility.multipleIntentDetection(undefined, undefined, true))
    assert.throws(() => utility.multipleIntentDetection(undefined, undefined))
  })
})

describe('utility intentDetection', () => {
  const intentConv_payload = {
    transcript: 'créer moi un memo pour allez a vegas',
    confidence: '0.5',
    nlu: {
      intent: 'isConversational'
    },
    conversationData: {
      intent: 'isConversational'
    }
  }

  it('it should detect a conversational intent', function() {
    const isIntent = utility.intentDetection(intentConv_payload, intentKey.isConversational, true)
    assert.ok(isIntent.isIntent)
    assert.ok(isIntent.isConversational)
  })

  it('it should detect an intent', function() {
    let new_intentConv_payload = intentConv_payload
    new_intentConv_payload.conversationData = {}

    const isIntent = utility.intentDetection(intentConv_payload, intentKey.isConversational, true)
    assert.ok(isIntent.isIntent)
    assert.equal(isIntent.isConversational, false)
  })

  it('it should not detect any intent', function() {
    const intentDetection = utility.intentDetection(intentConv_payload, intentKey.isFake, true)
    assert.equal(intentDetection.isIntent, false)
    assert.equal(intentDetection.isConversational, false)
  })

  it('it should throws an execption if require parameter missing', function() {
    assert.throws(() => utility.intentDetection(undefined, intentKey.isFake, true))
    assert.throws(() => utility.intentDetection(undefined, intentKey.isFake))
    assert.throws(() => utility.intentDetection(intentConv_payload, undefined, true))
    assert.throws(() => utility.intentDetection(intentConv_payload, undefined))
    assert.throws(() => utility.intentDetection(undefined, undefined, true))
    assert.throws(() => utility.intentDetection(undefined, undefined))
  })
})
