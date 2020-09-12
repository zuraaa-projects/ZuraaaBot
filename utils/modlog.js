const {client, config} = require("..");
const {Guild, MessageEmbed} = require("discord.js");

/**
 * 
 * @param {Guild} guild 
 */
module.exports = async (guild) => {
    if(guild.id == config.bot.guilds.main.id){
        const audictlist = await guild.fetchAuditLogs({
            limit: 1
        });


        const audict = audictlist.entries.first();

        if(audict.executor.id == client.user.id)
            return;

        let type = "";

        switch(audict.action){
            case "MEMBER_KICK":
                type = "expulsou";
                break;
            case "MEMBER_BAN_ADD":
                type = "baniu";
                break;
            case "MEMBER_BAN_REMOVE":
                type = "desbaniu";
                break
        }

        if(type){
            const channel = guild.channels.cache.get(config.bot.guilds.main.channels.modlog) 
            channel.send(new MessageEmbed()
                .setDescription("Motivo: `" + audict.reason ? audict.reason : "Sem motivo informado." + "`")
                .setTitle(`${audict.executor.tag} ${type} ${audict.target.tag} (${audict.target.id})`)
                .setColor(config.bot.primaryColor)
            );
        }
    }
}