import zuraaa from '../../'
import ZuraaaApi from '../../modules/api/zuraaaapi'
import config from '../../../config.json'
import { DiscordAPIError, Guild, Role } from 'discord.js'

const api = new ZuraaaApi()

zuraaa.client.on('ready', () => {
    setStatus()
    setInterval(setStatus, 300000)
    // updateTop()
    console.log(zuraaa.client.user?.username + ' se encontra online!')
})

function setStatus() {
    api.getBotCount().then(count => {
        zuraaa.client.user?.setActivity("Todos os " + count.bots_count + " bots que estão na botlist 😋", {type: "WATCHING"})
    }).catch(console.warn)
}

async function updateTop() {
    const topBots = await api.getTopBots()
    const guildConfig = config.bot.guilds.main
    const guild = zuraaa.client.guilds.cache.get(guildConfig.id)

    const topDevsRole = await guild?.roles.fetch(guildConfig.otherroles.topbotdevs)
    const topOwners = topBots.map(bot => bot.owner)
    updateMembersRole(topDevsRole!, topOwners, guild!)

    const topBotsRole = await guild?.roles.fetch(guildConfig.otherroles.topbots)
    const topBotsIds = topBots.map(bot => bot._id)
    updateMembersRole(topBotsRole!, topBotsIds, guild!)

    setTimeout(updateTop, 30000)
}

async function updateMembersRole(role: Role, newIds: string[], guild: Guild) {
    const added: string[] = []

        // TODO: Consertar a remoção de cargos dos membros que não sejam mais topvoted

        newIds.filter(id => !added.includes(id)).forEach(memberId => {
        guild.members.cache.get(memberId)?.roles.add(role)
    })
}