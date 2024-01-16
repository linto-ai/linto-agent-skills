const debug = require('debug')('linto:linto-components:components:request')
const request = require('request')

class Request {

  async get(url, token) {
    try{

      let options = {
        url
      }
      token ? options.headers = { authorization: token } : null

      return new Promise((resolve, reject) => {
        try {
          request.get(options, function (error, response, body) {
            if (error) {
              reject(error)
            }
            if (response === undefined || response.statusCode >= 400) {
              reject(new Error('Service error'))
            }
            resolve(body)
          })
        } catch (error) {
          reject(error)
        }
      })

    }catch(err){
      throw err
    }
  }

  async post(url, form, token) {
    try {

      let options = {
        url,
        ...form
      }
      token && options.headers ? options.headers = {} : null
      token ? options.headers.authorization = token : null

      return new Promise((resolve, reject) => {
        try {
          request.post(options, function (error, response, body) {
            if (error) {
              reject(error)
            }
            if (response === undefined || response.statusCode >= 400) {
              reject(response)
            }
            resolve(body)
          })
        } catch (error) {
          reject(error)
        }
      })

    }catch(err){
      throw err
    }
  }


  async put(url, form, token) {
    try{

      let options = {
        url,
        ...form
      }
      token && options.headers ? options.headers = {} : null
      token ? options.headers.authorization = token : null

      return new Promise((resolve, reject) => {
        try {
          request.put(options, function (error, response, body) {
            if (error) {
              reject(error)
            }
            if (response === undefined || response.statusCode >= 400) {
              reject(response)
            }
            resolve(body)
          })
        } catch (error) {
          reject(error)
        }
      })
    }catch(err){
      throw err
    }
  }

  async custom(options, customHandler) {
    request(options, customHandler)
  }
}

module.exports = new Request()