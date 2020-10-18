import emojis from '../../emojis.json'
import { Command } from '../../modules/handler'
import { getMongoRepository } from 'typeorm'
import Bots from '../../modules/database/entity/bots'
import { MessageEmbed } from 'discord.js'
import config from '../../config.json'

class RemoveBot extends Command{
    name = 'removebot'

    constructor(){
        super()
        this.info = {
            description: 'Remove um bot da botlist.',
            module: 'Staff',
            usage: ['@bot', '{id}'],
            visible: true
        }
    }

    execute(){
        if(!this.msg.member?.hasPermission('ADMINISTRATOR') && !this.msg.member?.roles.cache.has(config.bot.guilds.main.staffroleid.mod))
            return this.msg.react(emojis.error.id)
        
        const botId = this.msg.mentions.users.first()?.id || this.args[0]

        const botRepo = getMongoRepository(Bots)
        botRepo.find({
            _id: botId
        }).then(botFind => {
            if(botFind.length == 0)
                return this.msg.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTitle(emojis.error.name + ' | Bot não está cadastrado.')
                )

            botRepo.remove(botFind).then(obj => {
                this.msg.react(emojis.ok.id)
            }).catch(console.log)
        })
    }
}

export default new RemoveBot()