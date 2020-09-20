const { config, emoji } = require("..");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'unmute',
    description: 'desmute os usuários',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !message.member.roles.cache.has(config.bot.guilds.main.staffroleid.checker) && !message.member.hasPermission('ADMINISTRATOR'))
            return message.react(emoji.error.id)

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send(`${emoji.error.name} | Não encontrei o alvo.`)

        let reason = args.slice(1).join(" ") || 'Sem motivo informado.'


        const member = message.guild.member(user);

        if (member) {

            if (!member.roles.cache.has(config.bot.guilds.main.otherroles.mute))
                return message.channel.send(`${emoji.error.name} | Este usuário não está mutado.`);

            await member.roles.remove(config.bot.guilds.main.otherroles.mute).catch(err => {
                message.channel.send(`${emoji.error.name} | Algum erro aconteceu: ${err}`)
                return console.log(err)
            }).then(() => {
                message.react(emoji.ok.id)
                const logchannel = message.guild.channels.cache.get(config.bot.guilds.main.channels.modlog),
                    embed = new MessageEmbed()
                        .setDescription(`**${message.author.tag}** desmutou **${member.user.tag}** (${member.id})\n\nMotivo: \`${reason}\``)
                        .setColor(config.bot.primaryColor)
                logchannel.send(embed)
            })
        }
    },
};