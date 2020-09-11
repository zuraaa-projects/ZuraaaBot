const { client, dbBotList } = require("../index");


client.on("ready", () => {
    setStatus();
    setInterval(setStatus, 300000);
    console.log("Bot ligou!");
})


async function setStatus(){
    const botsCount = await dbBotList.Bots.countDocuments().exec();
    client.user.setActivity("todos os " + botsCount + " bots que estão na botlist 😋", {type: "WATCHING"})
}