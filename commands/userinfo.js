const {Message, MessageEmbed} = require('discord.js')
const {dbBotList, config} = require("../index")

module.exports = {
    name: 'userinfo',
    description: 'Mostra as informações sobre um usuario e seus bots.',
    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute(msg, args){
        const mentioneduser = msg.mentions.users.first()
        const usearch = (mentioneduser) ? mentioneduser.id : (args[0]) ? args[0] : msg.author.id
        
        msg.client.users.fetch(usearch).then(user => {
            const embed = new MessageEmbed()
                .setTitle('**' + user.tag + '**')
                .setColor(config.bot.primaryColor)
                .setThumbnail(user.avatarURL({
                    dynamic: true
                }))
                .setFooter('ID: ' + user.id)
                .setURL(`https://zuraaa.com/user/${user.id}`)


                dbBotList.Bots.find({   
                    $or: [
                        {
                            owner: user.id
                        },
                        {
                            'details.otherOwners': user.id
                        }
                    ]
                })
                    .exec()
                    .then(dbbot => {
                        let bots = ''
                        for(const botfind of dbbot){
                            bots += `[${botfind.username}#${botfind.discriminator}](https://zuraaa.com/bots/${botfind._id}/)\n`
                        }
                        
                        embed.setDescription(`**Bots desenvolvidos:\n${bots}**`)
                        msg.channel.send(embed)
                    })
            
        })
        .catch(err => {
            msg.channel.send(new MessageEmbed()
                .setDescription('Usuario não pode ser encontrado.')
                .setColor('RED')
            )
        })
        

    }
}