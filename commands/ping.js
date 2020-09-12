const {client} = require("..");

module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send(`**${client.ws.ping}ms**`);
	},
};