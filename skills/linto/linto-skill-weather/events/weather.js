const debug = require('debug')('linto:skill:v2:linto-skill:weather:events:weather')

module.exports = async function (msg) {
  return await this.controller[this.config.api](msg)
}