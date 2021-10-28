const { sequelize } = require('../connection/index')
const { DataTypes } = require('sequelize')
const { Type } = require('./Type')

const Pokemon = sequelize.define('pokemon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  hp: { type: DataTypes.INTEGER },
  attack: { type: DataTypes.INTEGER },
  defense: { type: DataTypes.INTEGER },
  speed: { type: DataTypes.INTEGER },
  height: { type: DataTypes.INTEGER },
  weight: { type: DataTypes.INTEGER },
  img: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Ruta defaul DB'
  },
  created: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  timestamps: false
})

Pokemon.belongsToMany(Type, { through: 'PokemonType', timestamps: false })
Type.belongsToMany(Pokemon, { through: 'PokemonType', timestamps: false })

module.exports = { Pokemon }
