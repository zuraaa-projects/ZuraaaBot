import { BaseCommand, Command, HelpInfo, HelpData } from '../../modules/handler'
import { EmbedFieldData, Message, MessageEmbed } from 'discord.js'
import config from '../../../config.json'
import emojis from '../../../emojis.json'

@Command('help', 'ajuda', 'commands')
@HelpInfo({
  module: 'Utils',
  description: 'Mostra os comandos do bot',
  usage: ['', '{comando}']
})
class Help extends BaseCommand {
  execute (): void {
    if (this.args.length === 0) {
      this.showAllCommands()
    } else {
      this.showCommandInfo()?.catch(console.error)
    }
  }

  async showCommandInfo (): Promise<Message> {
    const cmd = this.zuraaa.handler.commands.find(x => x.commandNames.findIndex(name => name === this.args[0]) !== -1)
    let hasCmd = true
    let cmdMetadata: HelpData
    if (cmd === undefined) {
      hasCmd = false
    }

    if (!hasCmd) {
      return this.msg.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(emojis.error.name + ' | Comando não foi encontrado.')
      )
    }

    cmdMetadata = Reflect.getMetadata('command:help', cmd?.CommandClass)

    if (cmdMetadata === undefined) {
      cmdMetadata = new HelpData()
    }

    if (cmdMetadata.visible === false) {
      hasCmd = false
    }

    const embed = new MessageEmbed()
      .setColor(config.bot.primaryColor)
      .setTitle(`**${cmd?.commandNames[0] as string}**`)
      .setDescription(cmdMetadata?.description)

    if (cmdMetadata?.usage === undefined) {
      cmdMetadata.usage = ['']
    }
    let usage = ''
    for (const argusage of cmdMetadata?.usage) {
      usage += config.bot.prefix + (cmd?.commandNames[0] as string) + ' ' + argusage + '\n'
    }

    embed.addField('Uso(s) do comando:', usage)

    if (cmd?.commandNames !== undefined && cmd?.commandNames.length > 1) {
      let aliases = ''
      cmd?.commandNames.forEach(alias => {
        aliases += alias + '\n'
      })
      embed.addField('Aliases:', aliases)
    }

    return this.msg.channel.send(embed)
  }

  showAllCommands (): void {
    const embed = new MessageEmbed()
      .setColor(config.bot.primaryColor)
      .setTitle('**Comandos do Bot:**')
      .setDescription('Use: `' + config.bot.prefix + 'help {nome do comando}` para mais informações.')

    const commandModules: CommandModules[] = []

    for (const cmd of this.zuraaa.handler.commands) {
      let helpData = Reflect.getMetadata('command:help', cmd.CommandClass) as HelpData

      if (helpData === undefined) {
        helpData = new HelpData()
      }

      if (helpData.visible === false) {
        continue
      }

      helpData.module = helpData.module ?? 'Default'

      const moduleIndex = commandModules.findIndex(x => x.module === helpData.module)

      if (moduleIndex === -1) {
        commandModules.push({
          module: helpData.module,
          commands: [cmd.commandNames[0]]
        })
      } else {
        commandModules[moduleIndex].commands.push(cmd.commandNames[0])
      }
    }

    const embedFields: EmbedFieldData[] = []

    for (const module of commandModules) {
      let cmdsname = ''

      module.commands.forEach(cmd => {
        cmdsname += '`' + cmd + '` '
      })

      embedFields.push({
        name: '**' + module.module + '**',
        value: cmdsname,
        inline: false
      })
    }

    embed.addFields(embedFields)
    this.msg.channel.send(embed).catch(console.error)
  }
}

interface CommandModules{
  module: string
  commands: string[]
}

export default Help
