const debug = require('debug')('linto:skill:v2:core:linto-config:chatbot-config')

module.exports = function (RED) {
  function LintoConfigChatbot(n) {
    RED.nodes.createNode(this, n)
    this.host = n.host
    this.rest = n.rest

    this.config = {
      host: n.host,
      rest: n.rest,
    }
  }
  RED.nodes.registerType("linto-config-chatbot", LintoConfigChatbot)
}