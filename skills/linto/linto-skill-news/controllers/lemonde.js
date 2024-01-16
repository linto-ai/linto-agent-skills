'use strict'

const debug = require('debug')('linto:skill:v2:linto-skill:news:controllers:lemonde')
const LanguageNotSupportedException = require('./exception/language').LanguageNotSupportedException
const parser = require('xml2json')

const lemondeData = require('./data/lemonde')
const NUMBER_TITLE = 5

module.exports = async function (type, lang) {
  if (lang !== 'fr-FR') {
    throw new LanguageNotSupportedException('This Language is not supported by LeMonde' + lang)
  }
  let newsTitle = getNewsTitles(type)

  let newsRss = await this.request.get(`${lemondeData.api}/${newsTitle}/${lemondeData.rss}`)
  let news = readNewsTitle(newsRss)
  return news
}

function readNewsTitle(jsonStr) {
  let json = parser.toJson(jsonStr)
  let channel = JSON.parse(json).rss.channel
  let titleList = []
  for (let i = 0; i < NUMBER_TITLE; i++) {
    titleList.push(channel.item[i].title)
  }
  return titleList.toString().replace(/,/g, ', ')
}

function getNewsTitles(type) {
  let gender = lemondeData.type_gender
  try {
    switch (true) {
      case (!type):
        return gender.type_international.value
      case (type === gender.type_cultural.entity_name):
        return gender.type_cultural.value
      case (type === gender.type_international.entity_name):
        return gender.type_international.value
      case (type === gender.type_pixel.entity_name):
        return gender.type_pixel.value
      case (type === gender.type_politique.entity_name):
        return gender.type_politique.value
      case (type === gender.type_societe.entity_name):
        return gender.type_societe.value
      case (type === gender.type_sport.entity_name):
        return gender.type_sport.value
      case (type === gender.type_world.entity_name):
        return gender.type_world.value
      default:
        return gender.type_international.value
    }
  } catch (err) {
    throw err
  }
}