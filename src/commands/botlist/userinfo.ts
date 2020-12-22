import { MessageEmbed } from 'discord.js'
import config from '@/config.json'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import emojis from '@/emojis.json'
import ZuraaaApi from '@modules/api/zuraaaapi'

@Command('userinfo', 'uinfo', 'userbots', 'user')
@HelpInfo({
  description: 'Mostra as informações de um usuario da botlist.',
  module: 'BotList',
  usage: ['', '@user', '{id}']
})
class UserInfo extends BaseCommand {
  execute (): void {
    const usearch = this.msg.mentions.users.first()?.id ?? this.args[0] ?? this.msg.author.id
    this.msg.client.users.fetch(usearch).then(user => {
      const embed = new MessageEmbed()
        .setTitle('**' + user.tag + '**')
        .setColor(config.bot.primaryColor)
        .setThumbnail(user.displayAvatarURL({
          dynamic: true
        }))
      const api = new ZuraaaApi()

      api.getUserBots(user.id).then(async bots => {
        const { details } = await api.getUser(user.id)
        let botsString = ''
        for (const botfind of bots) {
          botsString += `[${botfind.username}#${botfind.discriminator}](https://zuraaa.com/bots/${botfind._id}/)\n`
        }
        embed.setDescription(`${details.description !== null && details.description !== undefined ? details.description : 'Biografia não definida.'}\n\n**Bots desenvolvidos:\n${botsString}**`)
        this.msg.channel.send(embed)
          .catch(console.error)
      }).catch(() => {
        this.msg.channel.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(`${emojis.error.name} | O usuario solicitado não é cadastrado no Zuraaa`)
        )
          .catch(console.error)
      })
    }).catch(() => {
      this.msg.channel.send(new MessageEmbed()
        .setTitle(`${emojis.error.name} | Não encontrei o membro especificado :(`)
        .setColor('RED')
      )
        .catch(console.error)
    })
  }
}

export default UserInfo
