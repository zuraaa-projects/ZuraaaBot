const { config } = require("..");

module.exports = {
    name: 'mute',
    description: 'mute os usuários',
    async execute(message, args, emoji) {
        if (!message.member.roles.cache.has(config.bot.guilds.main.staffroleid.mod) && !message.member.hasPermission('ADMINISTRATOR'))
            return message.react(emoji.error.id)

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send(`${emoji.error.name} | Não encontrei o alvo.`)

        let reason = args.slice(1).join(" ") || 'Sem motivo informado.'


        const member = message.guild.member(user);

        if (member) {

            if (member.roles.cache.has(config.bot.guilds.main.otherroles.mute))
                return message.channel.send(`${emoji.error.name} | Este usuário já está mutado.`);

            await member.roles.add(config.bot.guilds.main.otherroles.mute).catch(err => {
                message.channel.send(`${emoji.error.name} | Algum erro aconteceu: ${err}`)
                return console.log(err)
            }).then(() => {
                message.react(emoji.ok.id)

                const logchannel = message.guild.channels.cache.get(config.bot.guilds.main.channels.modlog),
                {MessageEmbed} = require("discord.js"),
                    embed = new MessageEmbed()
                        .setDescription(`**${message.author.tag}** mutou **${member.user.tag}** (${member.id})\n\nMotivo: \`${reason}\``)
                        .setColor('#fcba03')
                logchannel.send(embed)
            })
        }
    },
};