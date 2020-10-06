import { MessageEmbed } from 'discord.js'
import config from '../../config.json'
import { Command } from '../../modules/handler'
import { getMongoRepository } from 'typeorm'
import Bots from '../../modules/database/entity/bots'
import emojis from '../../emojis.json'

class UserInfo extends Command {
    name = 'userinfo'

    execute(){
        const mentionedUser = this.msg.mentions.users.first()
        const userch = (mentionedUser) ? mentionedUser.id : (this.args[0]) ? this.args[0] : this.msg.author.id

        this.msg.client.users.fetch(userch).then(user => {
            const embed = new MessageEmbed()
                .setTitle('**' + user.tag + '**')
                .setColor(config.bot.primaryColor)
                .setThumbnail(user.displayAvatarURL({
                    dynamic: true
                }))
            const botRepository = getMongoRepository(Bots)
            botRepository.find({
                where: {
                    $or: [
                        {
                            owner: user.id
                        },
                        {
                            'details.otherOwners': user.id
                        }
                    ]
                }
            }).then(dbBot => {
                let bots = ''
                for(const botfind of dbBot)
                    bots += `[${botfind.username}#${botfind.discriminator}](https://zuraaa.com/bots/${botfind._id}/)\n`
                embed.setDescription(`**Bots desenvolvidos:\n${bots}**`)
                this.msg.channel.send(embed)
            })
        }).catch(err => {
            this.msg.channel.send(new MessageEmbed()
                .setTitle(emojis.error.name + ' | Usuario não pode ser encontrado.')
                .setColor('RED')
            )
        })
    }
}

export default new UserInfo()