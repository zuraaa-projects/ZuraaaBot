import glob from 'glob'
import { BaseCommand, CommandData } from './types'
import ZuraaaBot from '../../zuraaa-bot'
import config from '../../../config.json'
import _ from 'lodash'

class Handler{
    private _commands: CommandData[]

    constructor(zuraaa: ZuraaaBot){
        zuraaa.client.on('message', msg => {
            if(!msg.content.startsWith(config.bot.prefix) || msg.author.bot)
                return
            
            const args = msg.content
                .slice(config.bot.prefix.length)
                .trim()
                .split(/ +/)

            const cmd = args.shift()?.toLowerCase()

            if(!cmd)
                return

            const cmdFinded = this._commands.find(x => x.commandNames.findIndex(name => name == cmd) != -1)
            if(!cmdFinded)
                return
            
            
            try{
                const cmdObj = new cmdFinded.cmdClass() as BaseCommand
                cmdObj.msg = msg
                cmdObj.args = args
                cmdObj.execute()
            } catch(err){
                console.error(err)
            }
        })

        this._commands = []
    }

    get commands(){
        return this._commands
    }

    build(){
        this.registreCommands()
        this.registreEvents()
    }

    private registreCommands(){
        glob('./src/commands/**/*.ts', {
            absolute: true
        }, (err, files) => {
            console.log('Serão carregado: ' + files.length + ' comandos!')
            let index = 0
            for(const file of files){
                const cmd = require(file).default as BaseCommand
                
                this._commands.push({
                    commandNames: Reflect.getMetadata('command:names', cmd),
                    cmdClass: cmd
                })
                console.log((index + 1) + ': ' + file + ' carregado.')
                index++
            }

            console.log('\n')
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
            console.log('\n')
        })
    }
}

export default Handler