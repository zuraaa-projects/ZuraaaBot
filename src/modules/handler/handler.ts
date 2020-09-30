import { Collection } from 'discord.js'
import glob from 'glob'
import Command from './command'
import ZuraaaBot from '../../zuraaa-bot'
import config from '../../config.json'

class Handler{
    private _commands = new Collection()

    constructor(zuraaa: ZuraaaBot){
        zuraaa.client.on('message', msg => {
            if(!msg.content.startsWith(config.bot.prefix) || msg.author.bot)
                return
            
            const args = msg.content
                .slice(config.bot.prefix.length)
                .trim()
                .split(/ +/)

            const cmd = args.shift()?.toLowerCase()

            if(!this._commands.has(cmd))
                return
            
            try{
                const cmdObj = this._commands.get(cmd) as Command
                cmdObj.msg = msg
                cmdObj.args = args
                cmdObj.execute()
            } catch(err){
                console.error(err)
            }
        })
    }

    build(){
        this.registreCommands()
        this.registreEvents()
    }

    private registreCommands(){
        glob('./src/commands/**/*.ts', {
            absolute: true
        }, (err, files) => {
            for(const file of files){
                const cmd = require(file).default as Command
                this._commands.set(cmd.name, cmd)
            }
        })
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

export default Handler