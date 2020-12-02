import zuraaa from '../../'
import ZuraaaApi from '../../modules/api/zuraaaapi'
import config from '../../../config.json'

zuraaa.client.on('ready', () => {
    setStatus()
    setInterval(setStatus, 300000)
    console.log(zuraaa.client.user?.username + ' se encontra online!')
})

function setStatus(){
    const api = new ZuraaaApi()

    api.getBotCount().then(count => {
        zuraaa.client.user?.setActivity("Todos os " + count.bots_count + " bots que estão na botlist 😋", {type: "WATCHING"})
    }).catch(console.warn)

    api.getTopBots().then(async bots => {
        const main = config.bot.guilds.main;
        const servidor = zuraaa.client.guilds.cache.get(main.id);

        (await servidor?.roles.fetch(main.otherroles.topbots))?.members.map(m => {
            m.roles.remove(main.otherroles.topbots);
        });

        (await servidor?.roles.fetch(main.otherroles.topbotdevs))?.members.map(m => {
            m.roles.remove(main.otherroles.topbotdevs);
        });

        for(const bot of bots){
            servidor?.member(bot._id)?.roles.add(main.otherroles.topbots);
            servidor?.member(bot.owner)?.roles.add(main.otherroles.topbotdevs);
        }
    }).catch(console.warn)
}