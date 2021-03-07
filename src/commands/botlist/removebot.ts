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
      await this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Me informe o bot.`)
      )
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

      const guild = await this.zuraaa.client.guilds.fetch(config.bot.guilds.main.id)

      guild.member(botId)?.kick()
        .catch(console.error)
      this.msg.react(emojis.ok.id)
        .catch(console.error)

      if (bot !== undefined && bot.owner !== this.msg.author.id) {
        const reasonArg = this.args.slice(1).join(' ')
        const reason = reasonArg !== '' ? reasonArg : 'Sem motivo informado.'

        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle('Bot removido')
          .setFooter(`Removido por: ${this.msg.author.tag}`)
          .setDescription(`O bot \`${bot.username}#${bot.discriminator}\` foi removido da Botlist pelo seguinte motivo: \`${reason}\``)
        const siteLogs = guild.channels.resolve(config.bot.guilds.main.channels.sitelog) as TextChannel
        const ownerDM = guild.member(bot.owner)

        await siteLogs?.send(embed)
        await ownerDM?.send(embed)
      }
    }).catch(() => {
      this.msg.react(emojis.error.id)
        .catch(console.error)
    })
  }
}

export default RemoveBot
