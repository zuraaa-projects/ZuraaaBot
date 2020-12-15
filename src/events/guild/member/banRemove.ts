import zuraaa from '../../../'
import modlogs from '../../../modules/utils/bot/modlogs'

zuraaa.client.on('guildBanRemove', (guild) => {
  modlogs(guild)
})
