# linto-on-connect

Linto-on-connect is a skill listening that use the mqtt configuration on the current flow. It allow to notify any linto that connect their current flow settings. That will allow to update a linto on any new configuration for the linto-client (like the language) 


## MQTT Puplish 

Linto-On-Connect will publish on the topic: `<clientCode>/tolinto/<linto_id>/tolinto/tts_lang` the following message : 
```json
{
	value : "${current-flow-language}"
}
```

## MQTT On message

On connect don't use any message from the client yet.
