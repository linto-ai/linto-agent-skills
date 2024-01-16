const debug = require('debug')('linto:linto-components:template:node:connect-core')
const mqtt = require('../connect/mqtt')
const fs = require('fs')

const CoreNode = require('./core-node')

class CoreConnectNode extends CoreNode {
  constructor(node, config) {
    super(node, config)
    this.mqtt = new mqtt(this)
    this.topicHandler = {}
  }

  notifyEventError(topic, say, error) {
    if (this.wireEvent) {
      this.wireEvent.notifyOut(this.node.z, {
        topic,
        payload: {
          say,    //phonetic and text
          error
        }
      })
    }else{
      console.log('wire event is not define for connect-core-node')
    }
  }


  async configure() {
    return new Promise(async (resolve, reject) => {
      onDeletedNode.call(this)
      resolve(this)
    })
  }

  async autoloadTopic(pathDir) {
    const dir = await fs.promises.readdir(pathDir)
    dir.map(topicHandler => {
      if (topicHandler.toLocaleLowerCase().indexOf('.js') !== -1) {
        const name = topicHandler.split('.js')[0]
        this.topicHandler[name] = require(`${pathDir}/${name}`)
      }
    })
  }
}

function onDeletedNode() {
  let clientMqtt = this.mqtt
  if (this.mqtt) {
    this.node.on('close', (remove, done) => {
      clientMqtt.close()
      done()
    })
  }
}


module.exports = CoreConnectNode