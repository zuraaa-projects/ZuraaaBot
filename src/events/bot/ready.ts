import zuraaa from '../../'
import ZuraaaApi from '../../modules/api/zuraaaapi'
// import config from '../../../config.json'
// import { Guild, Role } from 'discord.js'

const api = new ZuraaaApi()

zuraaa.client.on('ready', () => {
  setStatus()
  setInterval(setStatus, 300000)
  // setInterval(updateTop, 30000) //! INDEV
  console.log(zuraaa.client.user?.username as string + ' se encontra online!')
})

function setStatus (): void {
  api.getBotCount().then(count => {
    zuraaa.client.user?.setActivity('Todos os ' + count.bots_count + ' bots que estão na botlist 😋', { type: 'WATCHING' })
      .catch(console.error)
  }).catch(console.warn)
}

// async function updateTop (): Promise<void> {
//   const topBots = await api.getTopBots()
//   const mainGuild = config.bot.guilds.main
//   const zuraaaDiscord = zuraaa.client.guilds.cache.get(mainGuild.id)
//   if (zuraaaDiscord === undefined) {
//     return
//   }

//   const topDevsRole = await zuraaaDiscord.roles.fetch(mainGuild.otherroles.topbotdevs)
//   const topDevsIds = topBots.map(bot => bot.owner)
//   if (topDevsRole !== null) {
//     updateRoles(topDevsRole, topDevsIds, zuraaaDiscord).catch(console.error)
//   }

//   const topBotsRole = await zuraaaDiscord?.roles.fetch(mainGuild.otherroles.topbots)
//   const topBotsIds = topBots.map(bot => bot._id)
//   if (topBotsRole !== null) {
//     updateRoles(topBotsRole, topBotsIds, zuraaaDiscord).catch(console.error)
//   }
// }

// async function updateRoles (role: Role, newIds: string[], guild: Guild): Promise<void> {
// TODO: REFATORAR TODO COMANDO DE ATUALIZAR OS CARGOS
// ! DEVEMOS PENSAR EM UMA FORMA MELHOR DE FAZER
// ? Como devemos fazer?
// * Nota: eu passei 3 horas olhando isso, não consigo pensar
// * em como fazer sem usar o cache e sem dar fetch em todos
// * os usuários (impossivel) pois nem o Discord e nem o DiscordJS possuem
// * uma forma de dar fetch em todos os membros **de uma determinada role**

// ? Possiveis soluções:
/// / Dar fetch em todos os usuários e depois comparar (impossível, limite de usuários por fetch)
/// / Dar fetch apenas nos usuários de uma determinada role (não encontramos como)
// * (Estou sem ideias)
// }
