'use strict'

const debug = require('debug')('linto:skill:v2:linto-skill:pollution:controllers:prevair')

const prevairData = require('./data/prevair')

module.exports = async function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]
  let location = this.payloadAction.extractEntityFromName(msg.payload, prevairData.location_key)
  let threshold

  if (location) {
    threshold = await getAirQuality.call(this, location.value.toUpperCase())
    location = location.value
  } else if (this.config.defaultCity) {
    threshold = await getAirQuality.call(this, this.config.defaultCity.toUpperCase())
    location = this.config.defaultCity
  } else {
    return { say: tts.say.error_no_city }
  }

  if (threshold) {
    return {
      say: {
        phonetic: `${location}${tts.say.threshold.phonetic}${threshold.phonetic}`,
        text: `${location}${tts.say.threshold.text}${threshold.text}`
      }
    }
  }
  return {
    say: {
      phonetic: `${location} ${tts.say.error_city_unfound.phonetic}`,
      text: `${location} ${tts.say.error_city_unfound.text}`
    }
  }
}
async function getAirQuality(city) {
  let tts = this.skillConfig[this.skillConfig.language]

  let date = (new Date().toISOString().split('T')[0]).replace(/-/g, '')
  let prevairResult = await this.request.get(`${prevairData.api}${date}`)
  let cityData = getCity(city, prevairResult)

  if (cityData) {
    return determinateAirQuality(cityData[7], tts.say)
  }
  return undefined
}

function getCity(city, prevairResult) {
  let jsonResponse = JSON.parse(prevairResult)
  for (let cityData of jsonResponse) {
    if (cityData[4] === city) {
      return cityData
    }
  }
  return undefined
}

function determinateAirQuality(airQualityStr, tts) {
  let airQuality = parseInt(airQualityStr)
  if (airQuality <= 2) {
    return tts.air_quality.very_good
  } else if (airQuality <= 4) {
    return tts.air_quality.good
  } else if (airQuality <= 5) {
    return tts.air_quality.average
  } else if (airQuality <= 7) {
    return tts.air_quality.poor
  } else if (airQuality <= 9) {
    return tts.air_quality.bad
  } else {
    return tts.air_quality.very_bad
  }
}

