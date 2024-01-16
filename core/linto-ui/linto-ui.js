const debug = require('debug')('linto:skill:v2:core:linto-ui')
const LintoCoreNode = require('@linto-ai/linto-components').nodes.lintoCoreNode
const { wireEvent } = require('@linto-ai/linto-components').components

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoUi(RED, this, config)
  }
  RED.nodes.registerType('linto-ui', Node)
}

class LintoUi extends LintoCoreNode {
  constructor(RED, node, config) {
    super(node, config)
    let done = null

    this.wireEvent = wireEvent.init(RED)

    if (this.checkConfig(node, config)) {
      this.ui = RED.require("node-red-dashboard")(RED)
      let html = HTML(node)

      this.done = this.ui.addWidget({
        node: node,
        group: config.group,
        width: config.width,
        height: config.height,
        format: html,		// HTML - Angular
        templateScope: "local",
        emitOnlyNewValues: false,
        forwardInputMessages: false,
        storeFrontEndInputAsState: false,
        order: 1,
        beforeEmit: (msg, value) => {
          return lintoUiBeforeEmit.call(node, msg, value)
        }
      })
    }
    this.init()
  }

  async init() {
    let flowCard = this.done
    this.node.on('close', (remove, done) => {
      this.wireEvent.unsubscribe(`${this.node.z}-${this.node.type}`)
      if (flowCard)
        flowCard()  //remove card when node is deleted
      done()
    })
  }

  checkConfig(node, conf) {
    if (!conf || !conf.hasOwnProperty("group")) {
      node.error(this.RED._("linto-ui.error.no-group"))
      return false
    }
    return true
  }
}

function lintoUiBeforeEmit(msg, value) {
  return {
    msg: {
      isShow : true,
      z: this.z,
      title: msg.payload.title, // card title
      html: msg.payload.html, // html code
      image: msg.payload.image, // img : { link, text }
      url: msg.payload.url // url : { link, text }
    }
  }
}

function HTML(node) {
  let html = LintoCoreNode.loadFile(__dirname, 'template/card.html')

  html = html.replace(`{{msg.z}}`, node.z).replace('##msg.title##', `UI flow :  ${node.z}`)
  return html
}