import { DataTypes, Model, Sequelize } from 'sequelize'

class Role extends Model {
  id!: number
  discordId!: string
}
export default (sequelize: Sequelize): typeof Role => {
  Role.init({
    discordId: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize: sequelize
  })
  return Role
}
