import zuraaa from '../../../'
import config from '../../../../config.json'
import {MessageEmbed, GuildMember, TextChannel} from 'discord.js'
import moment from 'moment'
import {getMongoRepository} from 'typeorm'
import Bots from '../../../modules/database/entity/bots'

zuraaa.client.on('guildMemberAdd', member => {
    const guildMember = member as GuildMember
    autoRole(guildMember)
    memberLog(guildMember)
})

function autoRole(member: GuildMember){
    const guilds = config.bot.guilds
    if(member.guild.id == guilds.bottest.id && member.user.bot)
        member.roles.add(guilds.bottest.autorole.botrole)
    else
        if(member.guild.id == guilds.main.id){
            if(member.user.bot)
                member.roles.add(guilds.main.autorole.botrole)
            else{
                member.roles.add(guilds.main.autorole.member)
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
                }).then(botUser => {
                    if(botUser && botUser.approvedBy)
                        member.roles.add(guilds.main.autorole.dev)
                })
            }
        }
}

function memberLog(member: GuildMember){
    if(member.guild.id != config.bot.guilds.main.id)
        return
    const channel = member.guild.channels.cache.get(config.bot.guilds.main.channels.wellcome) as TextChannel
    moment.locale('pt-br')
    const createdAt = moment(member.user.createdTimestamp)
    channel.send(new MessageEmbed()
        .setColor('#3ecc1f')
        .setTimestamp(member.joinedAt!)
        .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
        .setThumbnail(member.user.displayAvatarURL({
            dynamic: true
        }))
        .addFields([
            {
                name: 'Criação da conta:', 
                value: `${createdAt.format("LLLL")}\n\`${createdAt.toNow()}\``,
                inline: true
            },
            {
                name: 'Posição:',
                value: '`#' + member.guild.memberCount + '`',
                inline: true
            },
            {
                name: 'Bot:',
                value: (member.user.bot) ? 'Sim' : 'Não',
                inline: true
            }
        ])
        .setFooter(member.id)
    )
}