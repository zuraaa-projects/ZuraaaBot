import zuraaa from '@bot'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import { MessageEmbed } from 'discord.js'
import config from 'config.json'

@Command('ping', 'latência', 'latencia')
@HelpInfo({
  module: 'Utils',
  description: 'Mostra a latencia do bot',
  usage: ['z.ping']
})
class Ping extends BaseCommand {
  execute (): void {
    this.msg.channel
      .send(
        new MessageEmbed()
          .setColor(config.bot.primaryColor)
          .setTitle('Calculando ping...'))
      .then(async message => {
        const timestamp = this.msg.editedTimestamp != null && this.msg.editedTimestamp !== 0
          ? this.msg.editedTimestamp
          : this.msg.createdTimestamp
        await message.edit(
          new MessageEmbed()
            .setColor(config.bot.primaryColor)
            .setDescription(
              `**Ping:** ${message.createdTimestamp - timestamp}ms\n` +
              `**WebSocket:** ${zuraaa.client.ws.ping}ms`)
        )
      })
      .catch(console.error)
  }
}

export default Ping
