import zuraaa from '../../../'
import config from '../../../config.json'
import { Message, MessageEmbed } from 'discord.js'

zuraaa.client.on('message', msg => {
    selfMention(msg)
    reactSuggestion(msg)
})

function reactSuggestion(msg: Message){
    console.log({a: msg.channel.id, b: config.bot.guilds.main.channels.upDownChannels.findIndex(x => x == msg.channel.id)})
    if(config.bot.guilds.main.channels.upDownChannels.findIndex(x => x == msg.channel.id) != -1){
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