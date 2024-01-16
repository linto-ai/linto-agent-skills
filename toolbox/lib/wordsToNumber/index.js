/*
 * Copyright (c) 2017 Linagora.
 *
 * This file is part of Business-Logic-Server
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict'

class WordsToNumber {
  constructor() {
    this.language = {
      en: require('./data/en.json'),
      fr: require('./data/fr.json')
    }
  }

  wordsToNumber(words, language) {
    if (language && (language.toLowerCase() === 'fr' || language.toLowerCase() === 'fr-fr')) {
      return this.toNumber(words, this.language.fr)
    } else {
      return this.toNumber(words, this.language.en)
    }
  }

  // TODO: French work only between 0-100 at the moment
  toNumber(words, language) {
    let current, exponent, i, int, len, product, total, word, negative
    if (!isNaN(int = parseInt(words))) {
      return int
    }

    negative = words.indexOf('negative') === 0 || words.indexOf('-') === 0
    words = words.replace(/\sand\s/g, ' ').replace(/^negative\s/, '').replace(/^-\s/, '')
      .replace(/^a\s/, 'one ').replace(/,\s/g, ' ').replace(/first/g, 'one')
      .replace(/second/g, 'two').replace(/third/g, 'three').replace(/fourth/g, 'four')
      .replace(/fifth/g, 'five').replace(/eighth/g, 'eight').replace(/ninth/g, 'nine')
      .replace(/twelfth/g, 'twelve').replace(/twentieth/g, 'twenty').replace(/fiftieth/g, 'fifty')
      .replace(/seventieth/g, 'seventy').replace(/ninetieth/g, 'ninety')
      .replace(/(i|ie)?th(\b|-|$)/g, '').split(/[\s-]+/)

    total = 0
    current = 0
    for (i = 0, len = words.length; i < len; i++) {
      word = words[i]
      product = language.small[word]

      if (product) {
        // French specific rules
        if (word === 'et' && words[i + 1] && words[i + 1] === 'un') {
          i++
          current += 1
        } else if (product === language.small.quatre
              && words[i + 1] && words[i + 1] === 'vingt') {
          i++
          current += 80
        } else {
          current += product
        }

      } else if (word === 'hundred' && current !== 0) {
        current *= 100
      } else {
        exponent = language.large[word]
        if (exponent) {
          total += current * exponent
          current = 0
        } else {
          throw new Error('Unknown number: ' + word)
        }
      }
    }
    let output = total + current
    if (negative) {
      return output * -1
    }
    return output
  }
}

module.exports = new WordsToNumber()
