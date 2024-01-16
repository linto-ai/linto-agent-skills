const debug = require('debug')('linto:linto-components:components:terminal-out')
const { ToAskTerminalException, ToSayTerminalException, ToUiTerminalException } = require('../exception/terminal-out')
const terminalOutLabel = require('../data/label').components.terminalOut

class TerminalOut {

  /**
    * @summary Will trigger linto say mode
    *
    * @param {string} toSay string that linto gonna say
    *
    * @returns {Object} format json that linto gonna read to saying stuff
  **/
  toSay(toSay) {
    if (typeof toSay !== 'string')
      throw new ToSayTerminalException(terminalOutLabel.toSayTextEmpty)
    return { behavior: toSay }
  }

  /**
    * @summary Will trigger linto ask mode for linto with metadata
    *
    * @param {string} toAsk string that linto gonna say
    * @param {Objet} data data to keep for the next command
    *
    * @returns {Object} format json that linto gonna reud to asking stuff
  **/
  toAsk(toAsk, data) {
    if (typeof toAsk !== 'string')
      throw new ToAskTerminalException(text.toAskTextEmpty)
    if (!data)
      throw new ToAskTerminalException(terminalOutLabel.toAskDataEmpty)
    return { ask: toAsk, conversationData: data }
  }

  /**
    * @summary Will trigger linto ui mode
    *
  **/
  toUi(toUi) {
    // TODO: FORMAT NOT YET DEFINE
  }
}

module.exports = new TerminalOut()