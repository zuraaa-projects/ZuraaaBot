import { MessageEmbed, TextChannel } from 'discord.js'
import config from '../../config.json'
import emojis from '../../emojis.json'
import { Command } from '../../modules/handler'

class Mute extends Command {
    name = 'mute'

    execute(){
        if(!this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.checker) && !this.msg.member?.hasPermission('ADMINISTRATOR'))
            return this.msg.react(emojis.error.id)
        const user = this.msg.mentions.users.first() || this.msg.guild?.members.cache.get(this.args[0])
        if(!user)
            return this.msg.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle(emojis.error.name + ' | Não foi possivel encontrar o membro.')
            )
        let reason = this.args.slice(1).join(' ') || 'Sem motivo informado.'

        const member = this.msg.guild?.member(user)
        if(member){
            if(member.roles.cache.has(config.bot.guilds.main.otherroles.mute))
                return this.msg.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTitle(emojis.error.name + ' | Esse usuario já estava mutado.')
                )
            member.roles.add(config.bot.guilds.main.otherroles.mute)
                .catch(console.log)
                .then(() => {
                    this.msg.react(emojis.ok.id)

                    const logchannel = this.msg.guild?.channels.cache.get(config.bot.guilds.main.channels.modlog) as TextChannel
                    logchannel.send(new MessageEmbed()
                        .setDescription(`**${this.msg.author.tag}** mutou **${member.user.tag}** (${member.id})\n\nMotivo: \`${reason}\``)
                        .setColor(config.bot.primaryColor))
                })
        }
    }
}


export default new Mute()