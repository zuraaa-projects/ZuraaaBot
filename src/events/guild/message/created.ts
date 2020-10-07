import zuraaa from '../../../'
import config from '../../../config.json'
import { Message, MessageEmbed } from 'discord.js'

zuraaa.client.on('message', msg => {
    selfMention(msg)
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

function selfMention(msg: Message){
    if(!zuraaa.client.user)
        return

    const selfMention = msg.mentions.users.get(zuraaa.client.user.id)
    if(selfMention && msg.content.length < zuraaa.client.user.id.length + 5){
        msg.channel.send(new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle(`${msg.author.username}, meu prefixo é \`${config.bot.prefix}\`, para ver meus comandos basta usar o comando \`${config.bot.prefix}help\`!`))
    }
}