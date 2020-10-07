import { MessageEmbed } from 'discord.js'
import config from '../../config.json'
import emojis from '../../emojis.json'
import { Command } from '../../modules/handler'

class Ban extends Command {
    name = 'ban'

    constructor(){
        super()
        this.info = {
            visible: true,
            description: 'Bane um membro.',
            module: 'Moderação',
            usage: ['@user', '{id}'] 
        }
    }

    execute(){
        if(!this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !this.msg.member?.hasPermission('ADMINISTRATOR'))
            return this.msg.react(emojis.error.id)
        const user = this.msg.mentions.users.first() || this.msg.guild?.members.cache.get(this.args[0])
        if(!user)
            return this.msg.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle(emojis.error.name + ' | Membro não pode ser encontrado.')
            )

        const reason = this.args.slice(1).join(' ') || 'Sem motivo informado.'
        const member = this.msg.guild?.member(user)

        if(member)
            member.ban({
                reason: reason
            }).catch(console.log).then(() => this.msg.react(emojis.ok.id))

    }
}

export default new Ban()