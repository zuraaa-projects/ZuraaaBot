import zuraaa from '@/src'
import modlogs from '../../../modules/utils/bot/modlogs'

zuraaa.client.on('guildBanRemove', (guild) => {
  modlogs(guild)
})
