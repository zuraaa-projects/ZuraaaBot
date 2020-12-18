import { Sequelize } from 'sequelize'
import { SequelizeDatabase } from './types'

export default class LocalDatabase extends SequelizeDatabase {
  sequelize
  constructor (path: string) {
    super()
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path,
      logging: false
    })
  }

  async connect (): Promise<void> {
    try {
      await this.sequelize.authenticate()
      await this.sequelize.sync()
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Couldn't connect to database: ${error.message}.`)
      }
    }
  }
}
