const fs = require("fs");
const {Collection} = require("discord.js");
const {client, config, emoji} = require("../index");
const { dir } = require("console");

client.commands = new Collection();

const cmds = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for(const file of cmds){
    const cmd = require("../commands/" + file);
    client.commands.set(cmd.name, cmd);
}



client.on("message", message => {
    if(!message.content.startsWith(config.bot.prefix) || message.author.bot)
        return
    
    const args  = message.content.slice(config.bot.prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    if(!client.commands.has(cmd))
        return;

    try{
        client.commands.get(cmd).execute(message, args, emoji);
    } catch(err){
        console.error(err);
    }
})