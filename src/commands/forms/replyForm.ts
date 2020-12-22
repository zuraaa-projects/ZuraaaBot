// TODO: Implementar melhor esse comando para ser mais fácil a verificação e resposta de formulários!
// * const formID = this.args.join(' ')
// * console.log(formID)

import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import emojis from '@/emojis.json'
import config from '@/config.json'
import { Message, MessageEmbed, MessageReaction, TextChannel } from 'discord.js'

@Command('replyForm', 'rf', 'repform')
@HelpInfo({
  visible: false
})
class ReplyForm extends BaseCommand {
  async execute (): Promise<MessageReaction | Message | undefined> {
    if (this.msg.author.id !== '367425061122211843') {
      return await this.msg.react(emojis.error.id)
    }

    const user = this.msg.mentions.users.first() ?? this.msg.guild?.members.cache.get(this.args[0])
    if (user === undefined) {
      return await this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Não encontrei o membro especificado :(`)
      )
    }

    const candidato = this.msg.guild?.member(user)

    if (candidato === null || candidato === undefined) {
      return await this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error.name} | Não encontrei o membro especificado :(`)
      )
    }
    const username = candidato.user.username

    let resposta = this.args.slice(1).join(' ')
    if (resposta === '') {
      resposta = 'OK'
    }
    const { channels: { formlog } } = config.bot.guilds.main

    const log = async (text: string | string[]): Promise<Message> =>
      await (this.msg.guild?.channels.cache.get(formlog) as TextChannel).send(text)

    if (resposta === 'OK') {
      await log([`<@${candidato.id}>`, `${username} você foi aprovado para o cargo no qual foi candidato!`])
    } else {
      await log([`<@${candidato.id}>`, `${username} você foi recusado para o cargo no qual foi candidato pelo motivo: \`\`${resposta}\`\``])
    }

    return await this.msg.react(emojis.ok.id)
  }
}

export default ReplyForm
