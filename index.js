const Discord = require("discord.js");
const fs = require("fs");
const BotlistDB = require("./utils/database/botlist");

const config = require("./config.json");
const emoji = require("./emojis.json")

const client = new Discord.Client();
const dbBotList = new BotlistDB(config);

fs.readdir("./events/", (err, files) => {
    if(err)
        console.error(err);
    const eventsFiles = files.filter(file => file.split(".").pop() == "js");
    if(eventsFiles.length <= 0)
        return console.warn("Não existem eventos para ser carregado");
    console.log("Carregado: " + eventsFiles.length);
    eventsFiles.forEach((file, i) => {
        require("./events/" + file);
        console.log(`${i + 1}: ${file} carregado.`);
    });
});


client.login(config.bot.token);

module.exports = {
    client,
    config,
    dbBotList,
    emoji
}