import { Sequelize } from 'sequelize/types'
import MostVoted from './models/MostVoted'
import Role from './models/Role'

export abstract class SequelizeDatabase {
  abstract sequelize: Sequelize
  protected abstract connect (): void | Promise<void>
}

export interface Models {
  MostVoted: ReturnType<typeof MostVoted>
  Role: ReturnType<typeof Role>
}
