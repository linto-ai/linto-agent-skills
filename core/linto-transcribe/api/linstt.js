const debug = require('debug')(`linto:skill:v2:core:transcribe:linstt`)

const TRANSCRIBE_PATH = 'transcribe'

module.exports = async function (msg) {
  try {
    const tts = this.tts[this.getFlowConfig('language').language]
    if (msg.payload.audio) {
      let audioBuffer = Buffer.from(msg.payload.audio, 'base64')
      delete msg.payload.audio

      if (Buffer.isBuffer(audioBuffer)) {
        const useConfidenceScore = this.config.useConfidenceScore
        let options = prepareRequest(audioBuffer, useConfidenceScore)
        try {
          let requestUri = this.config.transcribe.host

          if (this.config.transcribe.commandOffline !== undefined && this.config.transcribe.commandOffline !== '') {
            requestUri = 'http://' + this.config.transcribe.commandOffline + '/' + TRANSCRIBE_PATH
          } else throw new Error('Configuration missing')

          const transcriptResult = await this.request.post(requestUri, options)
          msg =  wrapperLinstt(msg, transcriptResult, useConfidenceScore, this.config.confidenceThreshold )

          this.wireEvent.notifyCore(this.node.z, this.wireEvent.eventData.core.evaluate, msg)
        } catch (err) {
          this.sendEventError(msg, {...tts.say.unknown, errMessage: err.body, code: 500 })
          throw new Error(err)
        }
      }
    }else throw new Error('Input should containt an audio buffer')
  } catch (err) {
    console.error(err)
    throw err
  }
}

function prepareRequest(buffer, useConfidenceScore) {
  let accept = 'text/plain'
  if (useConfidenceScore) accept = 'application/json'

  let options = {
    headers: {
      accept,
    },
    formData: {
      file: {
        value: buffer,
        options: {
          filename: 'wavFile',
          type: 'audio/wav',
          contentType: 'audio/wav'
        }
      },
      speaker: 'no'
    },
    encoding: null
  }
  return options
}

function wrapperLinstt(msg, transcript, useConfidenceScore, confidenceThreshold) {
  try{

  let text = ""
  msg.data.confidence.stt.useConfidenceScore = useConfidenceScore

  if (useConfidenceScore) {
    let jsonTranscript = JSON.parse(transcript)
    if (!jsonTranscript || jsonTranscript.text.length === 0) throw new Error('Transcription was empty')

    if(jsonTranscript.speakers.length !== 0)
      jsonTranscript.speakers.map(speaker => speaker.words.map(words => text += words.word + " "))
    else if(jsonTranscript.words.length !== 0)
      jsonTranscript.words.map(words => text += words.word + " ")
    else throw new Error('Transcription was empty')

    if (text === "") throw new Error('Transcription was empty')

    msg.data.confidence.stt.confidenceThreshold = confidenceThreshold / 100
    msg.data.confidence.stt.confidenceScore = jsonTranscript['confidence-score']
  } else {
    text = transcript.toString('utf8')
    if (text === undefined || text.length === 0) throw new Error('Transcription was empty')
  }

  msg.data.transcript = text
  msg.payload.transcript = text
  return msg
}catch(err){
    throw err
  }
}