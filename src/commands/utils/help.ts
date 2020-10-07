import { Command } from '../../modules/handler'
import zuraaa from '../../'
import { EmbedFieldData, MessageEmbed } from 'discord.js'
import config from '../../config.json'
import emojis from '../../emojis.json'

interface ICommandModules {
    module: string
    commands: string[]
}

class Help extends Command{
    name = 'help'

    constructor(){
        super()
        this.info.module = 'Utils'
        this.info.description = 'Mostra os comandos do bot.'
        this.info.usage = ['', '{comando}']
    }

    execute(){
        
        if(zuraaa.handler.commands.size == 0)
            return this.msg.channel.send('Irmão o bot n tem comando.')


        if(this.args.length > 0){
            const cmd = zuraaa.handler.commands.get(this.args[0]) as Command

            if(!cmd || !cmd.info.visible)
                return this.msg.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTitle(emojis.error.name + ' | Comando não foi encontrado.')
                )

            const embed = new MessageEmbed()
                .setColor(config.bot.primaryColor)
                .setTitle('**' + cmd.name + '**')
                .setDescription(cmd.info.description)
            if(cmd.info.usage.length > 0){
                let usage = ''
                for (const argusage of cmd.info.usage)
                    usage += config.bot.prefix + cmd.name + ' ' + argusage + '\n'
                
                embed.addField('Usos do comando:', usage)
            }
            
           
            this.msg.channel.send(embed)
            return
        }
        
        const embed = new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle('**Comandos do Bot:**')
            .setDescription('Use: `' + config.bot.prefix + 'help {nome do comando}` para mais informações.')
            
        const commandModules: ICommandModules[] = []

        zuraaa.handler.commands.forEach(e => {
            const command = e as Command
            if(command.info.visible){
                const moduleIndex = commandModules.findIndex(x => x.module == command.info.module)
                if(moduleIndex == -1)
                    commandModules.push({
                        module: command.info.module,
                        commands: [command.name]
                    })
                else
                    commandModules[moduleIndex].commands.push(command.name)
            }
        })


        const embedsFilds: EmbedFieldData[] = []

        commandModules.forEach(mod => {
            let cmdsname = ''

            mod.commands.forEach(cmd => {
                cmdsname += '`' + cmd + '` '
            })

            embedsFilds.push({
                name: '**' + mod.module + ':**',
                value: cmdsname,
                inline: false
            })
        })
        

        embed.addFields(embedsFilds)
        this.msg.channel.send(embed)
    }
}

export default new Help()