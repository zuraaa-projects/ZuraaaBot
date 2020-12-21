import { MessageEmbed, Message } from 'discord.js'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import config from '@/config.json'
import Tags from '@modules/utils/botlist/tags'
import ZuraaaApi from '@modules/api/zuraaaapi'

@Command('bot', 'botinfo')
@HelpInfo({
  description: 'Mostra informação sobre um bot da botlist.',
  module: 'BotList',
  usage: ['@bot', '{id}']
})
class Bot extends BaseCommand {
  execute (): Promise<Message> | undefined {
    const mentionedBot = this.msg.mentions.members?.first()?.id ?? this.args[0]

    if (mentionedBot === undefined) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle('Você precisa mencionar um bot ou mandar o ID do bot.')
      )
    }

    const api = new ZuraaaApi()
    api.getBot(mentionedBot).then(async botfinded => {
      const botDiscord = await this.zuraaa.client.users.fetch(botfinded._id)

      let botowner = '`' + (await this.zuraaa.client.users.fetch(botfinded.owner)).tag + '`'
      for (const otherOwner of botfinded.details.otherOwners) {
        if (otherOwner !== null || otherOwner !== undefined) {
          botowner += '\n`' + (await this.zuraaa.client.users.fetch(otherOwner)).tag + '`'
        }
      }

      const tags = new Tags()
      this.msg.channel.send(new MessageEmbed()
        .setColor(config.bot.primaryColor)
        .setThumbnail(botDiscord.displayAvatarURL())
        .setTitle(botDiscord.tag)
        .setURL('https://zuraaa.com/bots/' + botDiscord.id)
        .setDescription(botfinded.details.shortDescription)
        .addFields([
          {
            name: 'Dono(s):',
            value: botowner,
            inline: true
          },
          {
            name: 'Votos:',
            value: botfinded.votes.current,
            inline: true
          },
          {
            name: 'Prefixo:',
            value: '`' + botfinded.details.prefix + '`',
            inline: true
          },
          {
            name: 'Biblioteca:',
            value: botfinded.details.library,
            inline: true
          },
          {
            name: 'Tags:',
            value: tags.convertTags(botfinded.details.tags).join('\n'),
            inline: true
          },
          {
            name: 'Links:',
            value: `[Votar](https://zuraaa.com/bots/${botDiscord.id}/votar)\n[Adicionar](https://zuraaa.com/bots/${botDiscord.id}/add)`,
            inline: true
          }
        ]))
        .catch(console.error)
    }).catch(async () => {
      return await this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle('O bot não pode ser encontrado.')
      )
    })
  }
}

export default Bot
