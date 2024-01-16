// Core Node
const lintoNode = require('./node-red-templates/node')
const lintoCoreNode = require('./node-red-templates/core-node')
const lintoCoreWireNode = require('./node-red-templates/core-wire-node')
const lintoCoreEventNode = require('./node-red-templates/core-event-node')
const lintoCoreConnectNode = require('./node-red-templates/core-connect-node')
const lintoDictionaryCoreNode = require('./node-red-templates/dictionary-core-node')
const lintoSkillNode = require('./node-red-templates/skill-node')

// Components
const payloadAction = require('./components/payload-action')
const redAction = require('./components/red-action')
const request = require('./components/request')
const template = require('./components/template')
const terminalOut = require('./components/terminal-out')
const wireEvent = require('./components/wire-event')
const wireNode = require('./components/wire-node')

// Connect
const authToken = require('./connect/authToken')
const mqtt = require('./connect/mqtt')

// Exception
const connectException = require('./exception/connect')
const nodeException = require('./exception/node')
const terminalException = require('./exception/terminal-out')
const wireException = require('./exception/wire')

module.exports = {
  nodes: {
    lintoNode,
    lintoCoreNode,
    lintoCoreWireNode,
    lintoCoreEventNode,
    lintoCoreConnectNode,
    lintoDictionaryCoreNode,
    lintoSkillNode,
  },
  components: {
    payloadAction,
    redAction,
    request,
    template,
    terminalOut,
    wireEvent,
    wireNode
  },
  connect: {
    authToken,
    mqtt
  },
  exception: {
    connectException,
    nodeException,
    terminalException,
    wireException
  },
}