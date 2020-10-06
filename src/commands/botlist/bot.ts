import { MessageEmbed } from 'discord.js'
import zuraaa from '../..'
import { Command } from '../../modules/handler'
import { getMongoRepository } from 'typeorm'
import Bots from '../../modules/database/entity/bots'
import config from '../../config.json'
import Tags from '../../modules/utils/botlist/tags'

class Bot extends Command{
    name = 'bot'

    execute(){
        const mentionedBot = this.msg.mentions.members?.first()
        const bsearch = (mentionedBot) ? mentionedBot.id : this.args[0]

        if(!bsearch)
            return this.msg.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle('Você precisa mensionar um bot ou mandar o ID de um.')
            )

        const botRepository = getMongoRepository(Bots)

        botRepository.find({
            _id: bsearch
        }).then(botsfinded => {
            if(botsfinded.length  == 0)
                this.msg.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTitle('O bot não pode ser encontrado.')
                )
            
            zuraaa.client.users.fetch(botsfinded[0]._id).then(async botDiscord => {
                let botowner = '`' + (await zuraaa.client.users.fetch(botsfinded[0].owner)).tag + '`'
                for (const ownerid of botsfinded[0].details.otherOwners)
                    if(ownerid)
                        botowner += '`' + (await zuraaa.client.users.fetch(ownerid)).tag + '`'
                
                const tags = new Tags()
                this.msg.channel.send(new MessageEmbed()
                    .setColor(config.bot.primaryColor)
                    .setThumbnail(botDiscord.displayAvatarURL())
                    .setTitle(botDiscord.tag)
                    .setURL('https://zuraaa.com/bots/' + botDiscord.id)
                    .setDescription(botsfinded[0].details.shortDescription)
                    .addFields([
                        {
                            name: 'Dono(s):',
                            value: botowner,
                            inline: true
                        },
                        {
                            name: 'Votos:',
                            value: botsfinded[0].votes.current,
                            inline: true
                        },
                        {
                            name: 'Prefixo:',
                            value: '`' + botsfinded[0].details.prefix + '`',
                            inline: true
                        },
                        {
                            name: 'Biblioteca:',
                            value: botsfinded[0].details.library,
                            inline: true
                        },
                        {
                            name: 'Tags:',
                            value: tags.convertTags(botsfinded[0].details.tags).join('\n'),
                            inline: true
                        },
                        {
                            name: 'Links:',
                            value: `[Votar](https://zuraaa.com/bots/${botDiscord.id}/votar)\n[Adicionar](https://zuraaa.com/bots/${botDiscord.id}/add)`,
                            inline: true
                        }
                    ]))
            })
    }
}