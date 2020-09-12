const {client, config, dbBotList} = require("..");
const {MessageEmbed} = require("discord.js");

client.on("guildMemberRemove", async (member) => {
    const guilds = config.bot.guilds;

    if(member.guild.id != guilds.main.id)
        return
    
    if(!member.user.bot){
        dbBotList.Bots.findOne({
            $or: [
                {
                    owner: member.id
                },
                {
                    "details.otherOwners": member.id
                }
            ]
        }).select("_id").exec().then(bot => {
            if(bot){
                if([...(bot.details.otherOwners || []), bot.owner].some(member.guild.fetch))
                    member.guild.members.fetch(bot.id).then(x => x.kick("Todos os donos saíram"));

            }
        });
    }

    const channel = member.guild.channels.cache.get(guilds.main.channels.wellcome);
    channel.send(new MessageEmbed({})
        .setColor("#f20c23")
        .setTimestamp(new Date())
        .setTitle(`**${member.user.username} #${member.user.discriminator}**`)
        .setFooter("ID: " + member.id)
        .setThumbnail(member.user.displayAvatarURL({
            dynamic: true
        }))
        .addField("Membros:", "`#" + member.guild.memberCount + "`", true)
        .addField("Bot:", (member.user.bot) ? "Sim" : "Não", true)
    );
    

})