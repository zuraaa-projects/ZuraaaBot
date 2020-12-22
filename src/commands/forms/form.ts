// ! TA UM POUCO ARMENGADO MAS É PORQUÊ FOI FEITO COM PRESSA
// TODO: OTIMIZAR ESSE COMANDO AO MÁXIMO POSSIVEL

import { EmbedFieldData, GuildChannel, GuildMember, Message, MessageEmbed, MessageReaction, TextChannel } from 'discord.js'
import config from '@/config.json'
import emojis from '@/emojis.json'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import moment from 'moment'

interface Question {
  type: 'string' | 'number' | undefined
  text: string
  check: (input: Message) => string
}

@Command('form')
@HelpInfo({
  module: 'Forms',
  description: 'Se alista para fazer parte de nossa Staff em algum cargo',
  usage: ['', '{cargo desejado}']
})
class Form extends BaseCommand {
  async execute (): Promise<void> {
    const generateUUID = (): string => {
      let dateTime = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, substring => {
        const r = (dateTime + Math.random() * 16) % 16 | 0
        dateTime = Math.floor(dateTime / 16)
        return (substring === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    }
    const defaultQuestions: Question[] = [
      {
        type: 'number',
        text: 'Qual sua idade?',
        check (input) {
          const num = Number(input.content)
          if (isNaN(num)) {
            return 'Sua resposta deve ser um número!'
          } else if (num < 13) {
            return 'LOLI'
          } else {
            return 'OK'
          }
        }
      },
      {
        type: 'string',
        text: 'Qual seu horário disponível? (modelo: HH:mm - HH:mm)',
        check (input) {
          if (moment(input.content, 'HH:mm - HH:mm', true).isValid()) {
            return 'OK'
          } else {
            return 'Você precisa especificar um horário válido: (modelo: HH:mm - HH:mm)'
          }
        }
      }
    ]

    const questionsVerificador: Question[] = [
      ...defaultQuestions,
      {
        type: 'string',
        text: 'Porquê quer se tornar verificador?',
        check (input) {
          if (input.content.length > 100) {
            return 'Você fala muito ein rapaz? Escreva até no máximo 100 caracteres por favor!'
          }
          return 'OK'
        }
      }
    ]

    const { staffroleid: { mod }, channels: { forms, formlog } } = config.bot.guilds.main
    const member = this.msg.author

    const log = async (text: string | string[]): Promise<Message> =>
      await (this.msg.guild?.channels.cache.get(formlog) as TextChannel).send(text)

    const filterMessage = (message: Message): boolean => message.author.id === member.id

    const endForm = (channel: GuildChannel, username: string, type: string, id: string, reason = 'finalizado'): NodeJS.Timeout =>
      setTimeout(() => {
        const endReason = `Formulário de ${username} para ${type} foi ${reason}! \nID: ${id}`
        log(['<@367425061122211843>', `${endReason}`])
          .catch(console.error)
        channel.delete(endReason)
          .catch(console.error)
      }, 5000)

    const createForm = (type: string, questions: Question[]): void => {
      const formID = generateUUID()
      const username = member.username
      const channelString = `form-${username}-${type}`
      this.msg.guild?.channels.create(channelString, {
        reason: `Formulário do ${username} para o cargo de ${type}`,
        topic: `ID: ${formID}`,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            type: 'member'
          },
          {
            id: this.msg.guild.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            type: 'role'
          },
          {
            id: mod,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            type: 'role'
          }
        ]
      })
        .then(async channel => {
          let i = 0
          const responses: EmbedFieldData[] = []

          channel.send(['------------------------', `<@${member.id}>`, 'Bem-vindo ao formulário! Responda as perguntas abaixo:', 'Você tem 60 segundos para responder cada uma delas', 'Para cancelar basta digitar "CANCELAR" à qualquer momento!', '------------------------'])
            .catch(console.error)

          const formSend = async (): Promise<void> => {
            const question = questions[i]
            if (question === undefined) {
              const form = new MessageEmbed()
                .setTitle(`Formulário para ${type}!`)
                .setDescription(`Enviado por: ${username} \n ID: ${formID}`)
                .setColor(config.bot.primaryColor)
                .addFields(responses)

              channel.send(`Formulário sendo enviado... Agradecemos por participar ${username}!`)
                .catch(console.error)
              const formsChannel = this.msg.guild?.channels.cache.get(forms) as TextChannel
              await formsChannel.send(form)
                .then(async () => await channel.send(['Formulário Enviado!', 'Excluindo este canal...']))
                .catch(console.error)
              endForm(channel, username, type, formID)
            } else {
              channel.send(question.text)
                .then(() => {
                  const collector = channel.createMessageCollector(filterMessage, { time: 1000 * 60, max: 1 })
                  collector.on('collect', (response: Message) => {
                    const checked = question.check(response)
                    if (response.content === 'CANCELAR') {
                      channel.send('Formulário sendo Cancelado...')
                        .then(async () => await channel.send(['Formulário Cancelado!', 'Excluindo este canal...']))
                        .catch(console.error)
                      endForm(channel, username, type, formID, 'cancelado')
                    } else if (checked === 'LOLI') {
                      channel.send('Formulário sendo Cancelado...')
                        .then(async () => await channel.send(['Você não deveria estar utilizando discord... :eyes:', 'O TOS do discord exisge que você tenha mais de 13 anos para utilizar os serviços de comunidação do discord']))
                        .catch(console.error)
                      endForm(channel, username, type, formID, 'LOLI DETECTADA!')
                    } else {
                      if (checked === 'OK') {
                        responses.push({
                          name: question.text,
                          value: response.content,
                          inline: false
                        })
                        i++
                        formSend()
                          .catch(console.error)
                      } else {
                        channel.send([`A pergunta "${question.text}" está reclamando: ${checked}`, 'Tente Novamente!'])
                          .then(async () => await formSend())
                          .catch(console.error)
                      }
                    }
                  })
                })
                .catch(console.error)
            }
          }

          formSend()
            .catch(console.error)
        })
        .catch(console.error)
    }

    const choice = this.args.join(' ')

    if (choice === '') {
      const forms = new MessageEmbed()
        .setTitle('**Formulários Zuraaa!**')
        .setColor(config.bot.primaryColor)
        .setDescription('Selecione um dos formulários utilizando o emoji correspondente!')
        .addFields([
          {
            name: `Verificador ${emojis.numbers.one.name}`,
            value: 'Faça essa aplicação para ser da equipe de verificação de bots!',
            inline: false
          }
        ])
        .setFooter('Novos formulários em breve! | Zuraaa!')

      this.msg.channel.send(forms).then(message => {
        message.react(emojis.numbers.one.id)
          .catch(console.error)
        const filterOne = (reaction: MessageReaction, user: GuildMember): boolean =>
          user.id === member.id && reaction.emoji.id === emojis.numbers.one.id

        const collectorOne = message.createReactionCollector(filterOne, { time: 1000 * 60 })
        collectorOne.on('collect', () => {
          createForm('verificador', questionsVerificador)
        })
      })
        .catch(console.error)
    } else if (choice === 'verificador') {
      createForm('verificador', questionsVerificador)
      this.msg.react(emojis.ok.id)
        .catch(console.error)
    } else {
      this.msg.react(emojis.error.id)
        .catch(console.error)
    }
  }
}

export default Form
