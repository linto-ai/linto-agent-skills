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

  search_payload = {
    transcript: 'créer moi un memo pour allez a vegas',
    confidence: '0.5',
    nlu: {
      intent: 'memo',
      entitiesNumber: 2,
      entities: [{
        start: 0,
        end: 5,
        entity: 'action_create',
        evaluated: false,
        subEntities: [],
        probability: 0.16410998496335738,
        mergeSupport: false,
        value: 'créer'
      }, {
        start: 10,
        end: 36,
        entity: 'expression',
        evaluated: false,
        subEntities: [],
        probability: 0.21005744098803678,
        mergeSupport: false,
        value: 'un memo pour allez a vegas'
      }]
    }
  }

describe('utility extractEntityFromPrefix', () => {
  it('it should extract the entitie action from prefix', function() {
    let prefixSearch = 'action',
      entitie = utility.extractEntityFromPrefix(search_payload, prefixSearch)
    assert.ok(entitie.entity.includes(prefixSearch))
    assert.equal(entitie.entity, 'action_create')
  })

  it('it should extract the entitie action from fullName', function() {
    let entitieSearch = 'expression',
      entitie = utility.extractEntityFromPrefix(search_payload, entitieSearch)
    assert.ok(entitie.entity.includes(entitieSearch))
    assert.equal(entitie.entity, 'expression')
  })

  it('it should not found an entitie', function() {
    let prefix = 'noEntitie',
      entitie = utility.extractEntityFromPrefix(search_payload, prefix)
    assert.equal(entitie, undefined)
  })
})

describe('utility extractEntityFromType', () => {
  it('it should extract the entitie action from type', function() {
    let prefixSearch = 'action_create',
      entitie = utility.extractEntityFromType(search_payload, prefixSearch)
    assert.equal(entitie.entity, 'action_create')
  })

  it('it should extract the entitie action from fullName', function() {
    let entitieSearch = 'expression',
      entitie = utility.extractEntityFromType(search_payload, entitieSearch)
    assert.equal(entitie.entity, 'expression')
  })

  it('it should not found an entitie by prefix', function() {
    let prefix = 'action',
      entitie = utility.extractEntityFromType(search_payload, prefix)
    assert.equal(entitie, undefined)
  })
})

describe('utility checkEntitiesRequire', () => {
  it('check if entitie array number match the payload', function() {
    assert.equal(utility.checkEntitiesRequire(search_payload, ['expression']), false)
  })

  it('check if both entitie is in payload', function() {
    assert.ok(utility.checkEntitiesRequire(search_payload, ['action_create', 'expression']))
  })
})
