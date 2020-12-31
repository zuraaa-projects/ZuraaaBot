import zuraaa from '@bot'
import config from '@/config.json'
import { Message, MessageEmbed } from 'discord.js'

zuraaa.client.on('message', msg => {
  selfMention(msg)
  reactSuggestion(msg)
})

function reactSuggestion (msg: Message): void {
  if (config.bot.guilds.main.channels.upDownChannels.findIndex(x => x === msg.channel.id) !== -1) {
    if (msg.content.startsWith('>')) {
      return
    }
    msg.react('👍')
      .catch(console.error)
    msg.react('👎')
      .catch(console.error)
  }
}

function selfMention (msg: Message): void {
  if (zuraaa.client.user === null) {
    return
  }
  
  const mentionRegex = RegExp(`^<@!?${zuraaa.client.user.id}>$`);

  //const selfMention = msg.mentions.users.get(zuraaa.client.user.id)
  if (msg.content.match(mentionRegex)) {
    const prefix: string = config.bot.prefix
    msg.channel.send(new MessageEmbed()
      .setColor(config.bot.primaryColor)
      .setTitle(`${msg.author.username}, meu prefixo é \`${prefix}\`, para ver meus comandos basta usar o comando \`${prefix}help\`!`))
      .catch(console.error)
  }
}
