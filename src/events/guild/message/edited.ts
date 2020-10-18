import zuraaa from '../../../'

zuraaa.client.on('messageUpdate', msg => {
    zuraaa.client.emit('message', msg)
})
