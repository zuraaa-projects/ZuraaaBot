import { DataTypes, Model, Sequelize } from 'sequelize'

class MostVoted extends Model {
  id!: string
  roleId!: string
}

export default (sequelize: Sequelize): typeof MostVoted => {
  MostVoted.init({
    id: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true
    }
  }, {
    sequelize
  })
  return MostVoted
}
