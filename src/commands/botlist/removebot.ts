import emojis from '@/emojis.json'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import { MessageEmbed } from 'discord.js'
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

    const reasonArg = this.args.slice(1).join(' ')
    const reason = reasonArg !== '' ? reasonArg : null

    api.removeBot(botId, this.msg.author.id, reason).then(async result => {
      if (!result.deleted) {
        return await this.msg.channel.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(`${emojis.error.name} | Bot não está cadastrado.`)
        )
      }

      this.msg.react(emojis.ok.id)
        .catch(console.error)
    }).catch((e) => {
      console.log('Error during removebot', e)
      this.msg.react(emojis.error.id)
        .catch(console.error)
    })
  }
}

export default RemoveBot
