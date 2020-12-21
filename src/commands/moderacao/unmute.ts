import { Message, MessageEmbed, MessageReaction, TextChannel } from 'discord.js'
import config from '../../../config.json'
import emojis from '../../../emojis.json'
import { BaseCommand, Command, HelpInfo } from '../../modules/handler'

@Command('unmute')
@HelpInfo({
  description: 'Desmuta um membro do servidor.',
  module: 'Moderação',
  usage: ['@user', '{id}']
})
class UnMute extends BaseCommand {
  execute (): Promise<MessageReaction> | Promise<Message> | undefined {
    if (this.msg.member === null) {
      return this.msg.react(emojis.error.id)
    }
    if (!this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.checker) && !this.msg.member?.hasPermission('ADMINISTRATOR')) {
      return this.msg.react(emojis.error.id)
    }
    const user = this.msg.mentions.users.first() ?? this.msg.guild?.members.cache.get(this.args[0])
    if (user === undefined) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(emojis.error.name + ' | Não encontrei o membro especificado :(')
      )
    }
    let reason = 'Sem motivo informado.'
    if (this.args.slice(1).join(' ') !== '') {
      reason = this.args.slice(1).join(' ')
    }
    const member = this.msg.guild?.member(user)
    if (member !== null && member !== undefined) {
      if (!member.roles.cache.has(config.bot.guilds.main.otherroles.mute)) {
        return this.msg.channel.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(emojis.error.name + ' | Esse usuario não estava mutado.')
        )
      }
      member.roles.remove(config.bot.guilds.main.otherroles.mute)
        .catch(console.error)
        .then(() => {
          this.msg.react(emojis.ok.id).catch(console.error)

          const logchannel = this.msg.guild?.channels.cache.get(config.bot.guilds.main.channels.modlog) as TextChannel
          logchannel.send(new MessageEmbed()
            .setDescription(`**${this.msg.author.tag}** desmutou **${member.user.tag}** (${member.id})\n\nMotivo: \`${reason}\``)
            .setColor(config.bot.primaryColor))
            .catch(console.error)
        })
        .catch(console.error)
    }
  }
}

export default UnMute
