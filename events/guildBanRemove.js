const {client} = require("..");
const modlog = require("../utils/modlog");

client.on("guildBanRemove", (guild, user) => {
    modlog(guild);
})