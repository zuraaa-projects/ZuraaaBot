import config from '../config.json'
import Discord from 'discord.js'
import { Handler } from './modules/handler'

class ZuraaaBot {
  private readonly _client = new Discord.Client()
  private readonly _handler: Handler

  constructor () {
    this._handler = new Handler(this)
  }

  get client (): Discord.Client {
    return this._client
  }

  get handler (): Handler {
    return this._handler
  }

  start (): void {
    this._handler.build()
    this._client.login(config.bot.token).catch(console.error)
  }
}

export default ZuraaaBot
