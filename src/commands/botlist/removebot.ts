import emojis from '@/emojis.json'
import config from '@/config.json'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import { MessageEmbed, TextChannel } from 'discord.js'
import ZuraaaApi from '@modules/api/zuraaaapi'

@Command('removebot', 'deletebot', 'rbot', 'dbot')
@HelpInfo({
  description: 'Remove um bot da botlist.',
  module: 'BotList',
  usage: ['@bot', '{id}']
})
class RemoveBot extends BaseCommand {
  async execute (): Promise<void> {
    const botId = this.msg.mentions.users.first()?.id ?? this.args[0]

    if (botId === undefined) {
      this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Me informe o bot.`)
      ).catch(console.error)
      return
    }

    const api = new ZuraaaApi()
    const bot = await api.getBot(botId)

    api.removeBot(botId, this.msg.author.id).then(async result => {
      if (!result.deleted) {
        return await this.msg.channel.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(`${emojis.error.name} | Bot não está cadastrado.`)
        )
      }

      let reason = 'Sem motivo informado.'
      if (this.args.slice(1).join(' ') !== '') {
        reason = this.args.slice(1).join(' ')
      }

      this.msg.guild?.member(botId)?.kick()
        .catch(console.error)
      this.msg.react(emojis.ok.id)
        .catch(console.error)

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Sucesso!')
        .setFooter(`Removido por: ${this.msg.author.username}#${this.msg.author.discriminator}`)
        .setDescription(`O bot \`${bot?.username as string}#${bot?.discriminator as string}\` foi removido da Botlist pelo seguinte motivo: \`${reason}\``)

      const siteLogs = this.msg.guild?.channels.cache.get(config.bot.guilds.main.channels.sitelog) as TextChannel
      const ownerDM = this.msg.guild?.members.cache.get(bot?.owner as string)

      await siteLogs.send(embed)
      await ownerDM?.send(embed)
    }).catch(() => {
      this.msg.react(emojis.error.id)
        .catch(console.error)
    })
  }
}

export default RemoveBot
