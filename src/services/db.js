const { Type } = require('../db/models/Type')
const { Pokemon } = require('../db/models/Pokemon')

function DBService () { }

DBService.prototype._format = (obj) => ({
  // Format the data with the necessary attributes
  id: obj.id,
  name: obj.name,
  height: obj.height,
  weight: obj.weight,
  img: obj.img,
  type: obj.types.map(obj => (obj.dataValues.name)),
  hp: obj.hp,
  attack: obj.attack,
  defense: obj.defense,
  speed: obj.speed,
  created: obj.created
})

DBService.prototype.getAllItems = function (model, relatedModel) {
  return new Promise((resolve, reject) => {
    let options // options is parameter to search with sequelize
    if (relatedModel) options = { include: [relatedModel] } // Set, for search attrs related in the model
    model.findAll(options)
      .then(response => {
        let items
        if (!relatedModel) {
          items = response.map(item => item.dataValues)
        } else {
          items = response.map(item => this._format(item.dataValues))
        }
        resolve(items)
      })
      .catch(err => reject(err))
  })
}

DBService.prototype.getItemById = function (id) {
  return new Promise((resolve, reject) => {
    Pokemon.findOne({ include: [Type], where: { id: id } })
      .then(response => {
        if (response) {
          resolve(this._format(response))
        } else {
          throw Error() // If id not match with some item in the db
        }
      })
      .catch(err => reject(err))
  })
}

DBService.prototype.getItemByName = function (name) {
  return new Promise((resolve, reject) => {
    Pokemon.findOne({ include: [Type], where: { name: name } })
      .then(response => {
        if (response) {
          resolve(this._format(response))
        } else {
          throw Error() // If name not match with some item in the db
        }
      })
      .catch(err => reject(err))
  })
}

DBService.prototype.insert = function (data, types) {
  return new Promise((resolve, reject) => {
    Pokemon.create(data) // Insert item in DB
      .then(newData => {
        Promise.all(types.map(name => Type.findByPk(name))) // Search types in DB
          .then(types => {
            newData.setTypes(types) // Set new data with types
            resolve(this.getItemByName(data.name)) // If it is successful it returns the formatted data
          })
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

DBService.prototype.saveTypeNames = (names) => {
  // Save the names from API, in the DB (Requirement the proyect)
  const promises = names.map(name => Type.create({ name })) // Generate array of promises
  Promise.all(promises)
    .then(() => console.log('Types saved in DB')) // eslint-disable-line no-console
    .catch(err => err)
}

module.exports = { DBService }
