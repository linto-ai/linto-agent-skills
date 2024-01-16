const debug = require('debug')('linto:skill:v2:linto-skill:welcome:events:capabilities')
const _ = require('lodash')

const MIN_ELEMENT = 2

module.exports = function (msg) {
  const flowNode = _.cloneDeep(this.flowNode)
  let skillsNode = flowNode
    .filter(node => node.type.indexOf('linto-skill') !== -1)
    .filter(node => node.description !== undefined)
    .filter(node => {
      if (node.description[this.skillConfig.language] !== undefined) {
        node.description = node.description[this.skillConfig.language]
        return node
      }
    })

  if (msg.payload.nlu.entitiesNumber === undefined || msg.payload.nlu.entitiesNumber === 0) {
    skillsNode = skillsNode.sort(() => 0.5 - Math.random()).slice(0, MIN_ELEMENT)
    skillsNode = skillsNode
  }

  let tts = this.skillConfig[this.skillConfig.language]
  let output = { ...tts.say.icando }
  skillsNode.map((node, i, arr) => {
    if (arr.length - 1 === i) {
      output.text += node.description + '.'
      output.phonetic += node.description + '.'
    } else {
      output.text += node.description + ', '
      output.phonetic += node.description + ', '
    }
  })
  return { say: output }
}