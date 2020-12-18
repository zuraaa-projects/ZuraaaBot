import config from '../config.json'
import Discord from 'discord.js'
import { Handler } from './modules/handler'
import MostVoted from './modules/database/models/MostVoted'
import Role from './modules/database/models/Role'
import { Models } from './modules/database/types'
import LocalDatabase from './modules/database/LocalDatabase'
class ZuraaaBot {
  private readonly _client = new Discord.Client()
  private readonly _handler: Handler
  private readonly _models: Models
  private readonly _localDatabase: LocalDatabase

  constructor () {
    this._handler = new Handler(this)
    this._localDatabase = new LocalDatabase('local.db')
    this._models = {
      MostVoted: MostVoted(this._localDatabase.sequelize),
      Role: Role(this._localDatabase.sequelize)
    }
    this._models.Role.hasMany(this._models.MostVoted)
    this._models.MostVoted.belongsTo(this._models.Role)
  }

  get client (): Discord.Client {
    return this._client
  }

  get handler (): Handler {
    return this._handler
  }

  get models (): Models {
    return this._models
  }

  start (): void {
    this._handler.build()
    this._localDatabase.connect().then(
      async () => await this._client.login(config.bot.token)
    ).catch(console.error)
  }
}

export default ZuraaaBot
