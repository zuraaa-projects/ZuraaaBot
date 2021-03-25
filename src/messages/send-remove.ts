import { Connection } from 'amqplib/callback_api'
import { Client, MessageEmbed, TextChannel } from 'discord.js'
import { bot } from '../../config.json'

interface RemoveDto {
  reason: string | null
  bot: {
    _id: string
    owner: string
    username: string
    discriminator: string
    details: {
      otherOwners: string[]
    }
  }
  author: {
    _id: string
    username: string
    discriminator: string
  }
}

export function sendRemove (client: Client, conn: Connection): void {
  conn.createChannel((err, channel) => {
    if (err !== undefined && err !== null) {
      throw err
    }

    const queue = 'sendRemove'

    channel.assertQueue(queue, {
      durable: false
    })

    channel.prefetch(1)

    channel.consume(queue, (msg) => {
      console.log('consumed channel')
      if (msg != null) {
        const remove: RemoveDto = JSON.parse(msg.content.toString())

        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle('Bot removido')
          .setFooter(`Removido por: ${remove.author.username}#${remove.author.discriminator}`)
          .setDescription(`O bot \`${remove.bot.username}#${remove.bot.discriminator}\` foi removido da Botlist`)

        if (remove.bot.owner !== remove.author._id) {
          embed.addField('Motivo', (remove.reason != null) ? remove.reason : 'Motivo não informado')

          client.users.fetch(remove.bot.owner)
            .then(user => {
              user.send(embed)
                .catch(() => {
                  console.error('Falha ao enviar a mensagem para o dono do bot')
                })
            })
            .catch(() => {
              console.error('Falha ao pegar o usuario')
            })
        }

        client.channels.fetch(bot.guilds.main.channels.sitelog)
          .then(guildChannel => {
            if (guildChannel instanceof TextChannel) {
              guildChannel.send(embed).catch(() => console.error('Falha ao enviar a mensagem de bot removido'))
            }
          })
          .catch(() => {
            console.error('Falha ao pegar o canal')
          })

        if (remove.bot.details.otherOwners != null) {
          for (let i = 0; i < remove.bot.details.otherOwners.length; i++) {
            const userId = remove.bot.details.otherOwners[i]

            client.users.fetch(userId)
              .then(user => {
                user.send(embed)
                  .catch(() => {
                    console.error('Falha ao enviar a mensagem para o usuario')
                  })
              })
              .catch(() => {
                console.error('Falha ao pegar o usuario')
              })
          }
        }

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(true)), {
          correlationId: msg?.properties.correlationId
        })
        channel.ack(msg)
      }
    })
  })
}
