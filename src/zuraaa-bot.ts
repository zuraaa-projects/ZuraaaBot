import config from './config.json'
import Discord from 'discord.js'
import glob from 'glob'


class ZuraaaBot{
    private _client = new Discord.Client()

    get client(){
        return this._client
    }

    start(){
        this.registreEvents()
        this._client.login(config.bot.token)
    }

    private registreEvents(){
        glob('./src/events/**/*.ts', {
            absolute: true
        }, (err, files) => {
            if(err)
                return console.error('Não foi possivel registrar os eventos: ' + err)
            if(files.length == 0)
                return console.warn('Nenhum evento foi registrado.')
            console.log('Serão carregado: ' + files.length + ' eventos!')
            files.forEach((file, index) => {
                require(file)
                console.log((index + 1) + ': ' + file + ' carregado.')
            })
        })
    }
}

export default ZuraaaBot