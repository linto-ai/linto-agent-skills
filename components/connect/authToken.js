const debug = require('debug')('linto:linto-components:connect:authToken')

const authTokenLabel = require('../data/label').connect.authToken
const request = require("request")

const ANDROID_BASE_TOKEN = 'Android'
const WEB_APPLICATION_BASE_TOKEN = 'WebApplication'

let options

class AuthToken {
  constructor() {
  }

  init(host) {
    options = {
      method: 'GET',
      url: host,
    }
    return this
  }

  async checkToken(token) {
    token ? options.headers = { authorization: token } : null
    return new Promise((resolve, reject) => {
      try {
        request.get(options, function (error, response, body) {
          if (error) {
            reject(error)
          }
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async isAuthEnableAndValidToken(payload, authFlowConfig) {
    if (payload.auth_token &&
      ((payload.auth_token.split(' ')[0] === ANDROID_BASE_TOKEN && authFlowConfig.auth_android === false)
        || (payload.auth_token.split(' ')[0] === WEB_APPLICATION_BASE_TOKEN && authFlowConfig.auth_web === false))) {
      return false
    } else {
      let response = await this.checkToken(payload.auth_token)
      if (response.statusCode === 200) return true
      else return false
    }
  }
}

module.exports = new AuthToken()