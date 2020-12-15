import config from '../../../../config.json'
import { Guild, MessageEmbed, TextChannel, User } from 'discord.js'

export default (guild: Guild): void => {
  guild.fetchAuditLogs({
    limit: 1
  }).then(audictList => {
    const audictEntry = audictList.entries.first()
    let type = ''
    switch (audictEntry?.action) {
      case 'MEMBER_KICK':
        type = 'expulsou'
        break
      case 'MEMBER_BAN_ADD':
        type = 'baniu'
        break
      case 'MEMBER_BAN_REMOVE':
        type = 'desbaniu'
        break
    }

    if (type !== '') {
      const userTargget = audictEntry?.target as User
      const channel = guild.channels.cache.get(config.bot.guilds.main.channels.modlog) as TextChannel
      const motivo = audictEntry?.reason ?? 'Sem motivo informado.'
      channel.send(new MessageEmbed()
        .setDescription(`Motivo: \`${motivo}\``)
        .setTitle(`${audictEntry?.executor.tag as string} ${type} ${userTargget.tag} (${userTargget.id})`)
        .setColor(config.bot.primaryColor)
      ).catch(console.error)
    }
  }).catch(console.error)
}
