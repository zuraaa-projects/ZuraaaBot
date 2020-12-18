import zuraaa from '../../'
import ZuraaaApi from '../../modules/api/zuraaaapi'
import config from '../../../config.json'
import { DiscordAPIError, Guild, GuildMember } from 'discord.js'

const api = new ZuraaaApi()

zuraaa.client.on('ready', () => {
  setStatus()
  setInterval(setStatus, 300000)
  updateTop().catch(console.error)
  setInterval(() => {
    updateTop().catch(console.error)
  }, 36e5)
  console.log(zuraaa.client.user?.username as string + ' se encontra online!')
})

function setStatus (): void {
  api.getBotCount().then(count => {
    zuraaa.client.user?.setActivity('Todos os ' + count.bots_count + ' bots que estão na botlist 😋', { type: 'WATCHING' })
      .catch(console.error)
  }).catch(console.warn)
}

async function updateTop (): Promise<void> {
  const topBots = await api.getTopBots()
  const mainGuild = config.bot.guilds.main
  const zuraaaDiscord = zuraaa.client.guilds.cache.get(mainGuild.id)
  if (zuraaaDiscord === undefined) {
    return
  }

  const topDevsIds = topBots.map(bot => bot.owner)
  await updateRoles(mainGuild.otherroles.topbotdevs, [...new Set(topDevsIds)], zuraaaDiscord)

  const topBotsIds = topBots.map(bot => bot._id)
  await updateRoles(mainGuild.otherroles.topbots, topBotsIds, zuraaaDiscord, true)
}

async function updateRoles (roleId: string, newIds: string[], guild: Guild, bot?: boolean): Promise<void> {
  const { MostVoted, Role } = zuraaa.models
  const [{ id: dbRoleId }] = await Role.findOrCreate({
    limit: 1,
    where: {
      discordId: roleId
    }
  })
  const cachedUsers = (await MostVoted.findAll({
    where: {
      RoleId: dbRoleId
    },
    attributes: ['id']
  })).map(user => user.id)
  if (cachedUsers.length === 0) {
    console.warn(`Sme informações dos usuários com o cargo ${roleId}.`)
  }
  const withoutRole = newIds.filter(userId => !cachedUsers.includes(userId))
  const toRemove = cachedUsers.filter(userId => !newIds.includes(userId))

  const change = (userId: string, operation: 'add' | 'remove', action?: (member: GuildMember) => Promise<void>): void => {
    guild.members.fetch(userId).then(member => {
      member?.roles[operation](roleId).catch(console.error)
      if (action !== undefined) {
        action(member).catch(console.error)
      }
    }).catch(error => {
      if (!(error instanceof DiscordAPIError && error.code === 10007)) {
        console.error(error)
      }
    })
  }
  withoutRole.forEach(userId => {
    change(userId, 'add')
  })
  await MostVoted.bulkCreate(
    withoutRole.map(userId => ({
      id: userId, RoleId: dbRoleId
    }))).catch(console.error)

  const isBot = bot !== undefined && bot
  toRemove.forEach(userId => {
    change(userId, 'remove', async member => {
      if (isBot) {
        await member.setNickname('')
      }
    })
  })
  await MostVoted.destroy({
    where: {
      id: toRemove
    }
  })
  if (isBot) {
    newIds.forEach((userId, index) => {
      guild.members.fetch(userId).then(member => {
        if (member !== null) {
          member.setNickname(`${index + 1}° ${member.user.username}`).catch(console.error)
        }
      }).catch(error => {
        if (!(error instanceof DiscordAPIError && error.code === 10007)) {
          console.error(error)
        }
      })
    })
  }
}
