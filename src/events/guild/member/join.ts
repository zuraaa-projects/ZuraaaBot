import zuraaa from '@bot'
import config from '@/config.json'
import { MessageEmbed, GuildMember, TextChannel } from 'discord.js'
import moment from 'moment'
import ZuraaaApi from '@modules/api/zuraaaapi'
import formatError from '@/src/modules/utils/formatError'

zuraaa.client.on('guildMemberAdd', member => {
  autoRole(member)
  memberLog(member)
})

function autoRole (member: GuildMember): void {
  const guilds = config.bot.guilds
  if (member.guild.id === guilds.bottest.id && member.user.bot) {
    member.roles.add(guilds.bottest.autorole.botrole)
      .catch(console.error)
  } else
  if (member.guild.id === guilds.main.id) {
    if (member.user.bot) {
      member.roles.add(guilds.main.autorole.botrole)
        .catch(console.error)
    } else {
      const api = new ZuraaaApi()
      api.getUserBots(member.id).then(botUser => {
        if (botUser.length > 0 && botUser.findIndex(x => x.approvedBy) !== -1) {
          member.roles.add(guilds.main.autorole.dev)
            .catch(console.error)
        }
      })
        .catch(error => {
          if (error.response.status === 404) {
            return
          }

          formatError('Houve um erro ao requisitar os bots do usuário de ID: ' + member.id, error)
        })

      member.roles.add(guilds.main.autorole.member)
        .catch(console.error)
    }
  }
}

function memberLog (member: GuildMember): void {
  if (member.guild.id !== config.bot.guilds.main.id) {
    return
  }
  const channel = member.guild.channels.cache.get(config.bot.guilds.main.channels.wellcome) as TextChannel
  moment.locale('pt-br')
  const createdAt = moment(member.user.createdTimestamp)
  channel.send(new MessageEmbed()
    .setColor('#3ecc1f')
    .setTimestamp(member.joinedAt as Date)
    .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .addFields([
      {
        name: 'Criação da conta:',
        value: `${createdAt.format('LLLL')}\n\`${createdAt.fromNow()}\``,
        inline: true
      },
      {
        name: 'Posição:',
        value: `\`#${member.guild.memberCount}\``,
        inline: true
      },
      {
        name: 'Bot:',
        value: (member.user.bot) ? 'Sim' : 'Não',
        inline: true
      }
    ])
    .setFooter(member.id)
  )
    .catch(console.error)
}
