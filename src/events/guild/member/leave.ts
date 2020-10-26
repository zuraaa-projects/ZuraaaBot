import zuraaa from '../../../'
import {GuildMember, MessageEmbed, TextChannel} from 'discord.js'
import modlogs from '../../../modules/utils/bot/modlogs'
import config from '../../../../config.json'
import {getMongoRepository} from 'typeorm'
import Bots from '../../../modules/database/entity/bots'

zuraaa.client.on('guildMemberRemove', member => {
    if(member.guild.id != config.bot.guilds.main.id)
        return
    const completeMember = member as GuildMember
    modlogs(completeMember.guild)
    sendMemberLog(completeMember)
    removeBots(completeMember)
})

function removeBots(member: GuildMember){
    if(!member.user.id){
        const botRepo = getMongoRepository(Bots)
        botRepo.findOne({
            where: {
                $or: [
                    {
                        owner: member.id
                    },
                    {
                        'details.otherOwners': member.id
                    }
                ]
            }
        }).then(bot => {
            if([...(bot?.details.otherOwners || []), bot?.owner].some(member.guild.fetch) && bot)
                member.guild.members.fetch(bot._id).then(x => x.kick('Todos os donos sairam'))
        })
    }
}

function sendMemberLog(member: GuildMember){
    const channel = member.guild.channels.cache.get(config.bot.guilds.main.channels.wellcome) as TextChannel
    channel.send(new MessageEmbed()
    .setColor('#f20c23')
    .setTimestamp(new Date())
    .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
    .setFooter('ID: ' + member.id)
    .setThumbnail(member.user.displayAvatarURL({
        dynamic: true
    }))
    .addFields([
        {
            name: 'Membros:',
            value: '`#' + member.guild.memberCount + '`',
            inline: true
        },
        {
            name: 'Bot:',
            value: (member.user.bot) ? 'Sim' : 'Não',
            inline: true
        }
    ]))
}