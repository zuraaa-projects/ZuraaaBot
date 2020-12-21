import { BaseCommand, Command, HelpInfo } from '@modules/handler'
import ZuraaaApi from '@modules/api/zuraaaapi'
import emojis from '@/emojis.json'

@Command('resetvotes')
@HelpInfo({
  visible: false
})
class ResetVotes extends BaseCommand {
  async execute (): Promise<void> {
    const api = new ZuraaaApi()
    try {
      const result = await api.resetVotes(this.msg.author.id)
      if (result) {
        this.msg.react(emojis.ok.id).catch(console.error)
      } else {
        this.msg.react(emojis.error.id).catch(console.error)
      }
    } catch (err) {
      this.msg.react(emojis.error.id).catch(console.error)
    }
  }
}
export default ResetVotes
