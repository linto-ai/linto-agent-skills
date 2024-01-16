const debug = require('debug')(`linto:skill:v2:linto-skill:synapse:controllers:getUserConversation`)

module.exports = async function (chatbot, sn) {
  try{
    const options = {
      headers: { 
        'content-type': 'application/json',
        botKey : chatbot.bot_key
      },
      body: { userId: sn },
      json: true
    }

    return await this.request.put(chatbot.api, options)
  }catch(error){
    throw error
  }
}