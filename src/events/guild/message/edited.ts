import zuraaa from '@bot'
import { Message } from 'discord.js'

zuraaa.client.on('messageUpdate', (_old, newer) => {
  zuraaa.client.emit('message', newer as Message)
})
