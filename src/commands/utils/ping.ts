import zuraaa from '@bot'
import { BaseCommand, Command, HelpInfo } from '@modules/handler'
@Command('latencia', 'ping')
@HelpInfo({
  module: 'Utils',
  description: 'Mostra a latencia do bot',
  usage: ['z.ping']
})
class Ping extends BaseCommand {
  execute (): void { 
 this.msg.channel.send(`Ping: ${Date.now() - this.msg.createdTimestamp}ms\nWebSocket:  ${zuraaa.client.ws.ping}ms`)
 .catch(console.error)
  }
}

export default Ping