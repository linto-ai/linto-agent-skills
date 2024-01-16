const debug = require('debug')(`linto:skill:v2:linto-skill:browser-control:events:podcast`)
const intent = 'browser_control_podcast'

module.exports = function(msg) {
    let tts = this.skillConfig[this.skillConfig.language] // data/tts.json loaded in this.skillConfig

    if (msg.payload.nlu.entitiesNumber !== 1) return { say: tts.say.error_entities_number }

    let action
    for (let payloadEntity of msg.payload.nlu.entities) {
        if (payloadEntity.entity === 'start') action = 'start'
        else if (payloadEntity.entity === 'stop') action = 'stop'
        else if (payloadEntity.entity === 'pause') action = 'pause'
        else if (payloadEntity.entity === 'next') action = 'next'
        else if (payloadEntity.entity === 'previous') action = 'previous'
    }

    return {
        customAction: {
            kind: 'podcast_' + action
        },
        say: {
            phonetic: intent + '_' + action,
            text: intent + '_' + action
        }
    }
}