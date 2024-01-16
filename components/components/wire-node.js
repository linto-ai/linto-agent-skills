const debug = require('debug')('linto:linto-components:components:wire-node')
const wireNodeLabel = require('../data/label').components.wireNode

class WireNode {

  onMessageSend(registerNode, handler, successMsg) {
    if (registerNode.node._wireCount === 0) {
      registerNode.node.status({ fill: 'yellow', shape: 'ring', text: wireNodeLabel.noLinkedWire })
    } else {
      
      if(!handler) errorhandler(registerNode, {message : wireNodeLabel.noFunctionLoaded})
      else{
        registerNode.node.on('input', async (payload, send, done) => {
          try {
            printStatusMsg(registerNode, successMsg)
            send(await handler.call(registerNode, payload)) // Load result function to the node
            persistStatusMsg(registerNode, successMsg)

            done()
          } catch (error) {
            errorhandler(registerNode, error)
          }
        })
        registerNode.node.status({})
      }
    }
  }

  onMessage(registerNode, handler, successMsg) {
    if(!handler) errorhandler(registerNode, {message : wireNodeLabel.noFunctionLoaded})
    else {
      registerNode.node.on('input', async (payload, send, done) => {
        try {
          printStatusMsg(registerNode)
          await handler.call(registerNode, payload)
          persistStatusMsg(registerNode, successMsg)

          done()
        } catch (error) {
          errorhandler(registerNode, error)
        }
      })
    }
  }

  nodeSend(registerNode, payload) {
    registerNode.send(payload)
  }
}

function printStatusMsg(registerNode) {
  registerNode.node.status({ fill: 'green', shape: 'ring' })
}

function persistStatusMsg(registerNode, text) {
  if (!text) {
    setTimeout(function () {
      registerNode.node.status({})
    }, registerNode.statusTimer);
  } else {
    registerNode.node.status({ fill: 'green', shape: 'ring', text })
  }
}

function errorhandler(registerNode, error) {
  console.error(error)

  let errorMessage = error.message
  if (!error.message)
    errorMessage = wireNodeLabel.handlerError

  registerNode.node.status({ fill: 'red', shape: 'ring', text: errorMessage })
}

module.exports = new WireNode()