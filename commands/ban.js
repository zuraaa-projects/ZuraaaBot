const { config, emoji } = require("../index");

module.exports = {
    name: "ban",
    description: "Bane um usuário ou bot do servidor.",

    execute(msg, args) {

        if (!msg.member.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !msg.member.hasPermission('ADMINISTRATOR'))
            return msg.react(emoji.error.id);

        const user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user)
            return msg.channel.send(emoji.error.name + " | Não encontrei o alvo.");

        const reason = args.slice(1).join(" ") || 'Sem motivo informado.',
            member = msg.guild.member(user);
            
        if (member) {
            member.ban({ reason: `Banido por ${msg.author.tag}. Motivo: ${reason}` }).catch(err => {
                msg.channel.send(`${emoji.error.name} | Algum erro aconteceu: ${err}`);
                return console.log(err);
            }).then(() => msg.react(emoji.ok.id));
        }
    }
}