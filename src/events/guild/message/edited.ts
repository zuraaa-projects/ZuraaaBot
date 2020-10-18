import zuraaa from '../../../'

zuraaa.client.on('messageUpdate', (old, newer) => {
    zuraaa.client.emit('message', newer)
})
