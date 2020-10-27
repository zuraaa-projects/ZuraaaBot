import { BaseCommand, Command, HelpInfo, HelpData } from '../../modules/handler'
import { EmbedFieldData, MessageEmbed } from 'discord.js'
import config from '../../../config.json'
import emojis from '../../../emojis.json'

@Command('help', 'ajuda', 'commands')
@HelpInfo({
    module: 'Utils',
    description: 'Mostra os comandos do bot',
    usage: ['', '{comando}']
})
class Help extends BaseCommand{
    execute(){
        if(this.args.length == 0)  
            this.showAllCommands()
        else
            this.showCommandInfo()
    }

    showCommandInfo(){
        const cmd = this.zuraaa.handler.commands.find(x => x.commandNames.findIndex(name => name == this.args[0]) != -1)
        let hasCmd = true
        let cmdMetadata: HelpData
        if(cmd){
            cmdMetadata = Reflect.getMetadata('command:help', cmd.cmdClass)

            if(!cmdMetadata)
                cmdMetadata = new HelpData()
            
            if(cmdMetadata.visible === false)
                hasCmd = false
        } else
            hasCmd = false

        if(!hasCmd)
            return this.msg.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle(emojis.error.name + ' | Comando não foi encontrado.')
            )

        const embed = new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle('**' + cmd!.commandNames[0] + '**')
            .setDescription(cmdMetadata!.description)

        cmdMetadata!.usage = cmdMetadata!.usage || ['']

        let usage = ''
        for (const argusage of cmdMetadata!.usage)
                usage += config.bot.prefix + cmd!.commandNames[0] + ' ' + argusage + '\n'
        
        embed.addField('Uso(s) do comando:', usage)
        
        if(cmd!.commandNames.length > 1){
            let aliases = ''
            cmd!.commandNames.forEach(x => aliases += x + '\n')
            embed.addField('Aliases:', aliases)
        }

        this.msg.channel.send(embed)
    }

    showAllCommands(){
        const embed = new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle('**Comandos do Bot:**')
            .setDescription('Use: `' + config.bot.prefix + 'help {nome do comando}` para mais informações.')

        const commandModules: CommandModules[] = []
        
        for(const cmd of this.zuraaa.handler.commands){
            let helpData = Reflect.getMetadata('command:help', cmd.cmdClass) as HelpData
            
            if(!helpData)
                helpData = new HelpData()
            
            if(helpData.visible === false)
                continue
            
            helpData.module = helpData.module || 'Default'
            
            const moduleIndex = commandModules.findIndex(x => x.module == helpData.module)

            if(moduleIndex == -1)
                commandModules.push({
                    module: helpData.module,
                    commands: [cmd.commandNames[0]]
                })
            else
                commandModules[moduleIndex].commands.push(cmd.commandNames[0])
        }
        
        const embedFilds: EmbedFieldData[] = []

        for(const module of commandModules){
            let cmdsname = ''

            module.commands.forEach(cmd => cmdsname += '`' + cmd + '` ')

            embedFilds.push({
                name: '**' + module.module + '**',
                value: cmdsname,
                inline: false
            })
        }

        embed.addFields(embedFilds)
        this.msg.channel.send(embed)
    }
}

interface CommandModules{
    module: string
    commands: string[]
}

export default Help