import glob from 'glob'
import { BaseCommand, CommandData } from './types'
import ZuraaaBot from '@/src/zuraaa-bot'
import config from '@/config.json'

class Handler {
  private readonly _commands: CommandData[]

  constructor (zuraaa: ZuraaaBot) {
    zuraaa.client.on('message', msg => {
      if (!msg.content.startsWith(config.bot.prefix) || msg.author.bot) {
        return
      }

      const args = msg.content
        .slice(config.bot.prefix.length)
        .trim()
        .split(/ +/)

      const cmd = args.shift()?.toLowerCase()

      if (cmd === undefined) {
        return
      }

      const cmdFinded = this._commands.find(command =>
        command.commandNames.findIndex(name => name === cmd) !== -1)

      if (cmdFinded === undefined) {
        return
      }

      try {
        const cmdObj = new cmdFinded.CommandClass() as BaseCommand
        cmdObj.msg = msg
        cmdObj.zuraaa = zuraaa
        cmdObj.args = args
        cmdObj.execute()
      } catch (err) {
        console.error(err)
      }
    })

    this._commands = []
  }

  get commands (): CommandData[] {
    return this._commands
  }

  build (): void {
    this.registreCommands()
    this.registreEvents()
  }

  private registreCommands (): void {
    glob('./src/commands/**/*.ts', {
      absolute: true
    }, (err, files) => {
      if (err !== null) {
        console.error(err)
      }
      console.log(`Serão carregados: ${files.length} comandos!`)
      files.forEach((file, index) => {
        // ! TEMPORÁRIO
        // TODO: Arranjar uma forma de não precisar desse disable
        // ? Como fazer isso sem utilizar require? Ou como evitar esse erro?
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cmd = require(file).default as BaseCommand
        this._commands.push({
          commandNames: Reflect.getMetadata('command:names', cmd),
          CommandClass: cmd
        })
        console.log(`${index + 1}: ${file} carregado.`)
      })
      console.log('\n')
    })
  }

  private registreEvents (): void {
    glob('./src/events/**/*.ts', {
      absolute: true
    }, (err, files) => {
      if (err !== null) {
        return console.error(`Não foi possivel registrar os eventos: ${err.name} - ${err.message}`)
      }
      if (files.length === 0) {
        return console.warn('Nenhum evento foi registrado.')
      }
      console.log(`Serão carregados: ${files.length} eventos!`)
      files.forEach((file, index) => {
        require(file)
        console.log(`${index + 1}: ${file} carregado.`)
      })
      console.log('\n')
    })
  }
}

export default Handler
