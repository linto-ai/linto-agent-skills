const debug = require('debug')(`linto:skill:v2:linto-skill:synapse:controllers:sendMessage`)

module.exports = async function (chatbot, user_conversation, text) {
  try{
    const options = {
      headers: { 
        'content-type': 'application/json',
        botKey : chatbot.bot_key
      },
      body: {
        text,
        watermark : user_conversation.watermark,
        // from: "user",
        from: user_conversation.serial_number,
        messageType: "UserMessage",
        data: []
      },
      json: true
    }
  
    let res = await this.request.post(`${chatbot.api}/${user_conversation.conversation_id}/message`, options)
    if(res.result === 0 && res.exceptions.errcode === 0){
      debug(`POST : ../${user_conversation.conversation_id}/message - Text : ${text} - Watermark : ${user_conversation.watermark}`)
      user_conversation.watermark++
      return user_conversation
    }

    throw new Error('Error while sending message to the chatbot')
  }catch(error){
    throw error
  }

}