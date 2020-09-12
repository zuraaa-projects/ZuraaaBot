const {client, config} = require("..");

client.on("message", msg => {
    if(msg.channel.id == config.bot.guilds.main.channels.suggestion){
        msg.react("👍");
        msg.react("👎");
    }
});