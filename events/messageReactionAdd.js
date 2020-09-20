const {client, config} = require("..");
const {MessageEmbed} = require("discord.js");

client.on("messageReactionAdd", (msgreaction, user) => { 
    if(msgreaction.message.channel.id == config.bot.guilds.main.channels.starboard)
        return;
    
    console.log(msgreaction.emoji.name);
    if(msgreaction.emoji.name == "⭐" && msgreaction.count >= 5 && !msgreaction.message.reactions.cache.has("star2")){
        const channel = msgreaction.message.guild.channels.cache.get(config.bot.guilds.main.channels.starboard);
        console.log("entrou");
        const starmsg = new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setTitle(`⭐${msgreaction.message.member.user.tag}⭐`)
            .setDescription(`[Ver mensagem](${msgreaction.message.url})\n\n${msgreaction.message.content}`)
            .setThumbnail(user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp(msgreaction.message.createdAt)


        const images = msgreaction.message.attachments.first();
        if(images){
            if(new RegExp("(.jpg|.gif|.png)").test(images.url)){
                starmsg.setImage(images.url);
            }
        }
        
        channel.send(starmsg);
        msgreaction.message.react("🌟");
    }
});