const {client, config, dbBotList} = require("../index");
const moment = require("moment");
const {MessageEmbed} = require("discord.js");


client.on("guildMemberAdd", member => {
    const guilds = config.bot.guilds;

    if(member.guild.id == guilds.bottest.id)
        member.roles.add(guilds.bottest.autorole.botrole);
    else
        if(member.guild.id == guilds.main.id){
            if(member.user.bot)
                member.roles.add(guilds.main.autorole.botrole);
            else{
                member.roles.add(guilds.main.autorole.member);
                if(dbBotList.Bots.findOne({
                    "$or": [
                        {
                            "owner": member.id
                        },
                        {
                            "details.otherOwners": member.id
                        }
                    ]
                }))
                    member.roles.add(guilds.main.autorole.dev);
            }

            const channel = member.guild.channels.cache.get(guilds.main.channels.wellcome);
            moment.locale("pt-br");
            const createdAt = moment(member.user.createdTimestamp);
            channel.send(new MessageEmbed({})
                .setColor("#3ecc1f")
                .setTimestamp(member.joinedAt)
                .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField("Criação da conta:", `${createdAt.format("LLLL")}\n\`${createdAt.toNow()}\``, true)
                .addField("Posição:", "`#" + member.guild.memberCount + "`", true)
                .addField("Bot:", (member.user.bot) ? "Sim" : "Não", true)
                .setFooter("ID: " + member.id)
            )
        }

})