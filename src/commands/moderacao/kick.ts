import emojis from '@/emojis.json'
import { BaseCommand, Command, HelpInfo } from '../../modules/handler'
import config from '@/config.json'
import { MessageEmbed, MessageReaction, Message } from 'discord.js'

@Command('kick')
@HelpInfo({
  description: 'Expulsa um membro do servidor.',
  module: 'Moderação',
  usage: ['@user', '{id}']
})
class Kick extends BaseCommand {
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
    if (!member.kickable) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Este Membro não pode ser expulso.`)
      )
    }
    let reason = 'Sem motivo informado.'
    if (this.args.slice(1).join(' ') !== '') {
      reason = this.args.slice(1).join(' ')
    }

    member.kick(reason)
      .catch(console.error)
      .then(async () => await this.msg.react(emojis.ok.id))
      .catch(console.error)
  }
}

export default Kick
