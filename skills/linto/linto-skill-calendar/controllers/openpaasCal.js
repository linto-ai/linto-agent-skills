const debug = require('debug')('linto:skill:v2:linto-skill:calendar:controllers:openpaas')
const request = require('request')
const uuidv1 = require('uuid/v1')
const icalToJcal = require('./jcal')

const openpaasApi = require('./data/openpaas')

class OpenPaasJcal {
  constructor(nodeConfig, language) {
    this.host = nodeConfig.host
    this.user = {
      mail: nodeConfig.user,
      authToken: 'Basic ' +
        new Buffer.from(nodeConfig.user + ':' + nodeConfig.password).toString('base64')
    }

    this.mail = nodeConfig.user
    this.language = language
  }

  async init(){
    await this.generateToken(this.user)
  }

  async generateToken(user) {
    let auth = await this.login(user)
    let userId = await this.userInfo(user)
    this.authorization = auth
    this.userId = userId
  }

  async login(user) {
    let options = {
      method: 'POST',
      url: `${this.host}${openpaasApi.token}`,
      headers: {
        authorization: user.authToken
      }
    }

    let authToken = await this.makeRequest(options).then((data) => {
      return 'Bearer ' + data.body.substr(1).slice(0, -1)
    }, (err) => {
      console.error(err)
      debug('Unable to generate the authorization token')
    })
    return authToken
  }

  async userInfo(user) {
    var options = {
      method: 'GET',
      url: `${this.host}${openpaasApi.user}`,
      headers: {
        authorization: user.authToken
      }
    }

    let userId = await this.makeRequest(options).then((data) => {
      let res = JSON.parse(data.body)
      return res.id
    }, (err) => {
      console.error(err)
      debug('Unable to get user Id')
    })
    return userId
  }

  async searchPeople(name) {
    var options = {
      method: 'POST',
      url: `${this.host}${openpaasApi.search_people}`,
      headers: {
        'content-type': 'application/json',
        authorization: this.authorization
      },
      body: { q: name, objectTypes: ['user', 'contact', 'ldap'], limit: 10 },
      json: true
    }

    return await this.makeRequest(options).then((data) => {
      return data
    }, (err) => {
      console.error(err)
      debug('Unable to get the next event')
      return err
    })
  }

  async getNext() {
    var options = {
      method: 'GET',
      url: `${this.host}${openpaasApi.next_event}`,
      headers: {
        authorization: this.authorization
      }
    }
    return await this.makeRequest(options).then((data) => {
      return data
    }, (err) => {
      console.error(err)
      debug('Unable to get the next event')
      return err
    })
  }

  async vcalCreateEvent(event) {
    let jcal = icalToJcal(this.host, event, this.mail)
    var options = {
      method: 'PUT',
      url: `${this.host}${openpaasApi.create_event}${this.userId}/${this.userId}/${uuidv1().ics}`, //userId === userDefaultCalendar
      headers: {
        'content-type': 'application/calendar+json',
        authorization: this.authorization
      },
      body: jcal,
      json: true
    }

    return await this.makeRequest(options).then((data) => {
      return data
    }, (err) => {
      console.error(err)
      debug('Unable to create an event')
      return err
    })
  }

  async deleteNext() {
    var options = {
      method: 'DELETE',
      url: `${this.host}${openpaasApi.next_event}`,
      headers: {
        authorization: this.authorization
      }
    }
    return await this.makeRequest(options).then((data) => {
      return data
    }, (err) => {
      console.error(err)
      debug('Unable to delete the next event')
      return err
    })
  }

  makeRequest(options) {
    return new Promise(function (resolve, reject) {
      try {
        request(options, function (err, resp, body) {
          if (err) {
            reject(err)
          } else if (resp.statusCode === 401) { // Unauthorized
            reject({ body: 'Unauthorized', status: resp.statusCode })
          } else if (resp.statusCode === 500) { // Internal Server Error from the API
            reject({ body: 'Server Error', status: resp.statusCode })
          } else if (resp.statusCode === 200) { // OK
            resolve({ body, status: resp.statusCode })
          } else if (resp.statusCode === 201) { // OK
            resolve({ body, status: resp.statusCode })
          } else if (resp.statusCode === 404) { // OK - Nothing to do or find
            resolve({ body, status: resp.statusCode })
          } else { // Unknow status
            reject('OpenPaas Error')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = OpenPaasJcal
