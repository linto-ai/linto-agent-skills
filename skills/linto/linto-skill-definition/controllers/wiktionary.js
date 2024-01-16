'use strict'

const debug = require('debug')('linto:skill:v2:linto-skill:definition:controllers:wiktionary')
const wd = require('word-definition')

module.exports = function (words) {
  let lang = this.skillConfig.lang
  return new Promise((resolve, reject) => {
    wd.getDef(words, lang, null, function (response) {
      debug(response)
      if (response) {
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}
