import { MessageEmbed, MessageReaction, Message } from 'discord.js'
import config from '@/config.json'
import emojis from '@/emojis.json'
import { BaseCommand, Command, HelpInfo } from '../../modules/handler'

@Command('ban')
@HelpInfo({
  description: 'Bane um membro.',
  module: 'Moderação',
  usage: ['@user', '{id}']
})
class Ban extends BaseCommand {
  execute (): Promise<MessageReaction> | Promise<Message> | undefined {
    if (this.msg.member === null) {
      return this.msg.react(emojis.error.id)
    }
    if (!this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !this.msg.member?.hasPermission('ADMINISTRATOR')) {
      return this.msg.react(emojis.error.id)
    }
    const user = this.msg.mentions.users.first() ?? this.msg.guild?.members.cache.get(this.args[0])
    if (user === undefined) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Não encontrei o membro especificado :(`)
      )
    }

    const member = this.msg.guild?.member(user)

    if (member === null || member === undefined) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Não encontrei o membro especificado :(`)
      )
    }

    if (!member.bannable) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Este Membro não pode ser banido.`)
      )
    }

    let reason = 'Sem motivo informado.'
    if (this.args.slice(1).join(' ') !== '') {
      reason = this.args.slice(1).join(' ')
    }

    member.ban({
      reason: reason
    })
      .catch(console.error)
      .then(async () => await this.msg.react(emojis.ok.id))
      .catch(console.error)
  }
}

export default Ban
