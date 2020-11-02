import zuraaa from '../../'
import ZuraaaApi from '../../modules/api/zuraaaapi'

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
}