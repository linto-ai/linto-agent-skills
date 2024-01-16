const debug = require('debug')('linto:linto-components:components:template')

// This compoents should be called with redAction.funcToCall.call(RED, ...param)
class TemplateNode {
  settupSkillTemplate(paletteName) {
    return {
      category: 'skills',
      color: '#f79a7d',

      inputs: 0,
      outputs: 1,

      icon: "font-awesome/fa-wrench",
      paletteLabel: paletteName
    }
  }

  settupDictionaryTemplate(paletteName) {
    return {
      category: 'dictionary',
      color: '#fbbe64',

      inputs: 1,
      outputs: 0,

      icon: "font-awesome/fa-book",
      paletteLabel: paletteName
    }
  }
}

module.exports = new TemplateNode()