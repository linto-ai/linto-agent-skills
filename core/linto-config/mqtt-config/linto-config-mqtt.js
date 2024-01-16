const debug = require('debug')('linto:skill:v2:core:linto-config:mqtt-config')

const TOPIC_FROM = 'fromlinto'
const TOPIC_TOLINTO = 'tolinto'

module.exports = function (RED) {
  function LintoConfigMqtt(n) {
    RED.nodes.createNode(this, n)
    this.host = n.host
    this.port = n.port
    this.scope = n.scope
    this.user = n.login
    this.password = n.password

    this.config = {
      host: n.host,
      port: n.port,

      user: n.login,
      password: n.password,

      scope: n.scope,
      fromLinto: n.scope + '/' + TOPIC_FROM,
      toLinto: n.scope + '/' + TOPIC_TOLINTO
    }
  }
  RED.nodes.registerType("linto-config-mqtt", LintoConfigMqtt)
}