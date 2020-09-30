import zuraaa from '../../'

zuraaa.client.on('ready', () => {
    console.log(zuraaa.client.user?.username + ' se encontra online!')
})