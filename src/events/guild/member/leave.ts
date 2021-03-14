import zuraaa from '@bot'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import modlogs from '@modules/utils/bot/modlogs'
import config from '@/config.json'
import ZuraaaApi from '@modules/api/zuraaaapi'
import formatError from '@/src/modules/utils/formatError'

zuraaa.client.on('guildMemberRemove', member => {
  if (member.guild.id !== config.bot.guilds.main.id) {
    return
  }
  const completeMember = member as GuildMember
  modlogs(completeMember.guild)
  sendMemberLog(completeMember)
  removeBots(completeMember)
})

function removeBots (member: GuildMember): void {
  const api = new ZuraaaApi()

  api.getUserBots(member.id).then(userBots => {
    for (const bot of userBots) {
      if ([bot.owner, ...bot.details.otherOwners].some(member.guild.fetch)) {
        member.guild.members.cache.get(bot._id)?.kick('Todos os donos sairam.')
          .catch(console.error)
      }
    }
  })
    .catch(error => {
      if (error.response.status === 404) {
        return
      }

      formatError('Houve um erro ao requisitar os bots do usuário de ID: ' + member.id, error)
    })
}

function sendMemberLog (member: GuildMember): void {
  const channel = member.guild.channels.cache.get(config.bot.guilds.main.channels.welcome) as TextChannel
  channel.send(new MessageEmbed()
    .setColor('#f20c23')
    .setTimestamp(new Date())
    .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
    .setFooter('ID: ' + member.id)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .addFields([
      {
        name: 'Membros:',
        value: `\`#${member.guild.memberCount}\``,
        inline: true
      },
      {
        name: 'Bot:',
        value: (member.user.bot) ? 'Sim' : 'Não',
        inline: true
      }
    ]))
    .catch(console.error)
}
