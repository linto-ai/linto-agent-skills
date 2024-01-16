const debug = require('debug')('linto:linto-components:components:payload-action')

class PayloadAction {

  /**
   * @summary Search for the first entity matching the searched prefix
   * 
   * @param {Object} payload the input message
   * @param {String} searchedPrefix the searched prefix in entities
   *
   * @returns {Object} The extracted entity from the payload
   **/
  extractEntityFromPrefix(payload, searchedPrefix) {
    for (let payloadEntity of payload.nlu.entities) {
      if (payloadEntity.entity.includes(searchedPrefix)) {
        return payloadEntity
      }
    }
    return
  }

  /**
    * @summary Search for the first entity matching the searched name
    * 
    * @param {Object} payload the input message
    * @param {String} searchedName the searched name entity
    *
    * @returns {Object} The entitiy or nothing
  **/
  extractEntityFromName(payload, searchedName) {
    for (let payloadEntity of payload.nlu.entities) {
      if (payloadEntity.entity === searchedName) {
        return payloadEntity
      }
    }
    return
  }

  /**
    * @summary Check if all require entities is in the payload
    *
    * @param {Object} payload the input message
    * @param {Array} requireEntities list of the require entities to find
    *
    * @returns {Boolean} Verify if entities searched entity is in the payload
  **/
  checkEntitiesRequire(payload, requireEntities = []) {
    if (payload.nlu.entitiesNumber >= requireEntities.length) {
      for (let payloadEntity of payload.nlu.entities) {
        if (requireEntities.indexOf(payloadEntity.entity) === -1) {
          return false
        }
      }
      return true
    }
    return false
  }

  /**
  * @summary Check if one entities require is in the payload
  *
  * @param {Object} payload the input message
  * @param {Array} requireEntities the prefix to the entitie to find
  *
  * @returns {Boolean} Verify if entities searched entity is in the payload
**/
  checkEntityRequire(payload, requireEntities = []) {
    for (let payloadEntity of payload.nlu.entities) {
      if (requireEntities.indexOf(payloadEntity.entity) !== -1) {
        return true
      }
    }
    return false
  }
}

module.exports = new PayloadAction()