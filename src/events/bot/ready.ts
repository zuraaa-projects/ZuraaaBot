import zuraaa from '../../'
import {getMongoRepository} from 'typeorm'
import Bots from '../../modules/database/entity/bots'

zuraaa.client.on('ready', () => {
    setStatus()
    setInterval(setStatus, 300000)
    console.log(zuraaa.client.user?.username + ' se encontra online!')
})

function setStatus(){
    const botsRepo = getMongoRepository(Bots)
    botsRepo.count().then(botsCount => {
        zuraaa.client.user?.setActivity("Todos os " + botsCount + " bots que estão na botlist 😋", {type: "WATCHING"})
    })
}