import {MessageEmbed, MessageReaction, TextChannel} from 'discord.js'
import zuraaa from '../../../'
import config from '../../../config.json'

zuraaa.client.on('messageReactionAdd', (reaction, user) => {
    starboard(reaction)
})

function starboard(reaction: MessageReaction){
    if(reaction.message.channel.id == config.bot.guilds.main.channels.starboard)
        return
    if(!reaction.count)
        return
    
    if(reaction.emoji.name == '⭐'&& reaction.count >= 5 && !reaction.message.reactions.cache.get('🌟')?.users.cache.has(zuraaa.client.user!.id)){
        const channel = reaction
            .message
            .guild
            ?.channels
            .cache
            .get(config.bot.guilds.main.channels.starboard) as TextChannel
        const starmsg = new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle(`⭐${reaction.message.member!.user.tag}⭐`)
            .setDescription(`[Ver mensagem](${reaction.message.url})\n\n${reaction.message.content}`)
            .setThumbnail(reaction.message.member!.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp(reaction.message.createdAt)
        const image = reaction.message.attachments.first()
        if(image)
            starmsg.setImage(image.url)
        
        channel.send(starmsg)
        reaction.message.react('🌟')
    }
}