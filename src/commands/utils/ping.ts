import zuraaa from '@bot'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import { MessageEmbed } from 'discord.js'
import config from 'config.json'

@Command('latencia', 'ping')
@HelpInfo({
  module: 'Utils',
  description: 'Mostra a latencia do bot',
  usage: ['z.ping']
})
class Ping extends BaseCommand {
  execute (): void {
    this.msg.channel.send(
      new MessageEmbed()
        .setColor(config.bot.primaryColor)
        .addField('Ping', `${Date.now() - this.msg.createdTimestamp}ms`)
        .addField('WebSocket', `${zuraaa.client.ws.ping}ms`)
    ).catch(console.error)
  }
}

export default Ping

