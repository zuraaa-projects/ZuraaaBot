import { MessageEmbed, MessageReaction, TextChannel } from 'discord.js'
import zuraaa from '@bot'
import config from '@/config.json'

zuraaa.client.on('messageReactionAdd', (reaction) => {
  starboard(reaction)
})

function starboard (reaction: MessageReaction): void {
  if (reaction.message.channel.id === config.bot.guilds.main.channels.starboard) {
    return
  }
  if (reaction.count === null) {
    return
  }
  if (reaction.emoji.name === '⭐' && reaction.count >= 5 && !(reaction.message.reactions.cache.get('🌟')?.users.cache.has(zuraaa.client.user?.id as string) as boolean)) {
    const channel = reaction
      .message
      .guild
      ?.channels
      .cache
      .get(config.bot.guilds.main.channels.starboard) as TextChannel
    const starmsg = new MessageEmbed()
      .setColor(config.bot.primaryColor)
      .setTitle(`⭐${reaction.message.member?.user.tag as string}⭐`)
      .setDescription(`[Ver mensagem](${reaction.message.url})\n\n${reaction.message.content}`)
      .setThumbnail(reaction.message.member?.user.displayAvatarURL({
        dynamic: true
      }) as string)
      .setTimestamp(reaction.message.createdAt)
    const image = reaction.message.attachments.first()
    if (image !== undefined) {
      starmsg.setImage(image.url)
    }

    channel.send(starmsg).catch(console.error)
    reaction.message.react('🌟').catch(console.error)
  }
}
