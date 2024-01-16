const debug = require('debug')('linto:linto-components:template:node:core-event')

const CoreNode = require('./core-node')
const wireEvent = require('../components/wire-event')

class LintoCoreEventNode extends CoreNode {
  constructor(RED, node, config) {
    super(node, config)

    this.wireEvent = wireEvent.init(RED)
  }

  // nodeFunction can be a file path or a function
  subscribeFunctionToEvent(nodeZ, nodeType, nodeFunction){

    if(typeof nodeFunction === 'string') nodeFunction = require(nodeFunction)
    this.wireEvent.subscribeCore.call(this, nodeZ, nodeType, nodeFunction.bind(this), false, true)

    let coreNode = this
    this.node.on('close', (remove, done) => {
      coreNode.wireEvent.unsubscribe(`${nodeZ}-${nodeType}`, true)
      done()
    })
  }
}

module.exports = LintoCoreEventNode