import { Connection } from 'amqplib/callback_api'
import { Client } from 'discord.js'

export function getUser (client: Client, conn: Connection): void {
  conn.createChannel((err, channel) => {
    if (err !== undefined && err !== null) {
      throw err
    }

    const queue = 'getUser'

    channel.assertQueue(queue, {
      durable: false
    })

    channel.prefetch(1)

    channel.consume(queue, (msg) => {
      console.log('consumed channel')
      if (msg != null) {
        const id = msg.content.toString()
        console.log('tring to fetch user', id)
        client.users.fetch(id).then(user => {
          console.log('received', user.username)
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(user)), {
            correlationId: msg.properties.correlationId
          })
          console.log('sent; ACKing')
          channel.ack(msg)
        }).catch(console.error)
      }
    })
  })
}
