import zuraaa from '../../../'
import config from '../../../config.json'
import { Message } from 'discord.js'

zuraaa.client.on('message', msg => {
    reactSuggestion(msg)
})

function reactSuggestion(msg: Message){
    if(msg.channel.id == config.bot.guilds.main.channels.suggestion){
        if(msg.content.startsWith('>'))
            return
        msg.react('👍')
        msg.react('👎')
    }
}