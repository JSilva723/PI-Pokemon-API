const { Type } = require('../db/models/Type')
const { Pokemon } = require('../db/models/Pokemon')
const { DBService } = require('../services/db')
const { APIService } = require('../services/api')
const db = new DBService()
const api = new APIService()

const getAllItems = () => new Promise((resolve, reject) => {
  db.getAllItems(Pokemon, Type) // Get items to db
    .then(itemsDB => {
      api.getAllItems(3) // Requirement the proyect: 40 iems
        .then(itemsAPI => resolve(itemsAPI.concat(itemsDB)))
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
})

const getItemByName = (name) => new Promise((resolve, reject) => {
  api.getItemByName(name)
    .then(item => resolve(item))
    .catch(err => {
      if (err.response.status === 404) {
        db.getItemByName(name)
          .then(item => resolve(item))
          .catch(err => reject(err))
      } else {
        reject(err)
      }
    })
})

const getItemById = (id) => new Promise((resolve, reject) => {
  api.getItemById(id)
    .then(item => resolve(item))
    .catch(err => {
      if (err.response.status === 404) {
        db.getItemById(id)
          .then(item => resolve(item))
          .catch(err => reject(err))
      } else {
        reject(err)
      }
    })
})

const saveTypes = () => {
  // This function load the types table when start the server, if the table is empty
  db.getAllItems(Type) // Check if there is values in DB
    .then(r => {
      if (r.length === 0) {
        api.getTypeNames() // Get types from API
          .then(names => db.saveTypeNames(names)) // Save in DB
          .catch(err => console.log(err)) // eslint-disable-line no-console
      }
    })
    .catch(err => console.log(err)) // eslint-disable-line no-console
}

module.exports = {
  saveTypes,
  getAllItems,
  getItemByName,
  getItemById
}
