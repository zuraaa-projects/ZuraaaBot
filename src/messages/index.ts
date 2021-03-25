import ZuraaaBot from '../zuraaa-bot'
import { getUser } from './get-user'
import rabbit from 'amqplib/callback_api'
import config from '../../config.json'
import { sendRemove } from './send-remove'

export function addQueues (zuraaa: ZuraaaBot): void {
  rabbit.connect(config.rabbit.url, (err, conn) => {
    if (err !== undefined && err !== null) {
      console.error('Rabbit não encontrado')
      return
    }
    getUser(zuraaa.client, conn)
    sendRemove(zuraaa.client, conn)
  })
}
