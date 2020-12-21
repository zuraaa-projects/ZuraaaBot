import config from '@/config.json'
import { Guild, MessageEmbed, TextChannel, User } from 'discord.js'

let lastLogId = ''

export default (guild: Guild): void => {
  guild.fetchAuditLogs({
    limit: 1
  }).then(audictList => {
    const audictEntry = audictList.entries.first()
    if (audictEntry === undefined || audictEntry.id === lastLogId) {
      return
    }
    const types: {
      [keyof: string]: string | undefined
    } = {
      MEMBER_KICK: 'expulsou',
      MEMBER_BAN_ADD: 'baniu',
      MEMBER_BAN_REMOVE: 'desbaniu'
    }
    const type = types[audictEntry.action]
    if (type !== undefined) {
      const userTargget = audictEntry.target as User
      const channel = guild.channels.cache.get(config.bot.guilds.main.channels.modlog) as TextChannel
      const motivo = audictEntry.reason ?? 'Sem motivo informado.'
      channel.send(new MessageEmbed()
        .setDescription(`Motivo: \`${motivo}\``)
        .setTitle(`${audictEntry.executor.tag} ${type} ${userTargget.tag} (${userTargget.id})`)
        .setColor(config.bot.primaryColor)
      )
        .catch(console.error)
      lastLogId = audictEntry.id
    }
  })
    .catch(console.error)
}
