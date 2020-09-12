const {Message, MessageEmbed} = require("discord.js");
const {dbBotList, config, client} = require("../index");
const {convertTags} = require("../utils/tags")();
module.exports= {
    name: "bot",
    description: "Mostra informações sobre um bot no BPD",
    /**
     * 
     * @param {Message} msg 
     * @param {String[]} args 
     */
    execute(msg, args){
        const mentionedbot = msg.mentions.users.first();
        const bsearch = (mentionedbot) ? mentionedbot.id : args[0];
        if(!bsearch){
            msg.channel.send(new MessageEmbed()
                .setColor("RED")
                .setTitle("Você precisa mensionar o bot ou mandar sua id.")
            )
            return;
        }

        dbBotList.Bots.findById(bsearch).exec().then(async bot => {
            if(!bot){
                msg.channel.send(new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Bot não encontrado.")
                )
                return;
            }
            const botd = await client.users.fetch(bot._id);
            let botowner = `\`${(await client.users.fetch(bot.owner)).tag}\``;

            for(const ownerid of bot.details.otherOwners){
                if(ownerid)
                    botowner += ` \`${(await client.users.fetch(ownerid)).tag}\``
            }
            msg.channel.send(new MessageEmbed()
                .setColor(config.bot.primaryColor)
                .setThumbnail(botd.displayAvatarURL())
                .setTitle(botd.tag)
                .setURL("https://zuraaa.com/bots/" + botd.id)
                .setDescription(bot.details.shortDescription)
                .addFields(
                    { name: "Dono(s):", value: `${botowner}`, inline: true },
                    { name: "Votos:", value: `${bot.votes.current}`, inline: true },
                    { name: "Prefixo:", value: "`" + bot.details.prefix + "`", inline: true },
                    { name: "Biblioteca:", value: `${bot.details.library}`, inline: true },
                    { name: "Tags:", value: `${convertTags(bot.details.tags).join("\n")}`, inline: true },
                    { name: "Links:", value: `[Votar](https://zuraaa.com/bots/${botd.id}/votar)\n[Adicionar](https://zuraaa.com/bots/${botd.id}/add)`, inline: true }
                )
            )
        })
    }
}