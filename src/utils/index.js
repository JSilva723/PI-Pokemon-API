const Type = require('../db/models/Type')
const Pokemon = require('../db/models/Pokemon')
const axios = require('axios')
axios.defaults.baseURL = 'https://pokeapi.co/api/v2' // Set defaults url

const saveTypes = () => {
  // This function load the types table when start the server, if the table is empty
  Type.findAll() // Check if there is values in DB
    .then(r => {
      if (r.length === 0) {
        axios.get('/type')
          .then(response => {
            const types = response.data.results // Array of obj
            const names = types.map(type => (type.name)) // Array of names
            const namesPromises = names.map(name => (Type.create({ name: name })))
            Promise.all(namesPromises)
              .then(() => console.log('Types saved in DB')) // eslint-disable-line no-console
              .catch(err => console.log(err)) // eslint-disable-line no-console
          })
          .catch(err => console.log(err)) // eslint-disable-line no-console
      }
    })
    .catch(err => console.log(err)) // eslint-disable-line no-console
}

const dataDB = (obj) => ({
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

const dataAPI = (obj) => ({
  // Format the data with the necessary attributes
  id: obj.id,
  name: obj.name,
  height: obj.height,
  weight: obj.weight,
  img: obj.sprites.front_default,
  type: obj.types.map(obj => (obj.type.name)),
  hp: obj.stats[0].base_stat,
  attack: obj.stats[1].base_stat,
  defense: obj.stats[2].base_stat,
  speed: obj.stats[5].base_stat
})

const itemAPIName = (name) => new Promise((resolve, reject) => {
  // If it is successful it returns the formatted data
  axios.get(`/pokemon/${name}`)
    .then(response => resolve(dataAPI(response.data)))
    .catch(err => reject(err))
})

const itemAPIId = (id) => new Promise((resolve, reject) => {
  // If it is successful it returns the formatted data
  axios.get(`/pokemon/${id}`)
    .then(response => resolve(dataAPI(response.data)))
    .catch(err => reject(err))
})

const itemDBId = (id) => new Promise((resolve, reject) => {
  // If it is successful it returns the formatted data
  Pokemon.findByPk(id, { include: [Type] })
    .then(response => resolve(dataDB(response)))
    .catch(err => reject(err))
})

const itemDBName = (name) => new Promise((resolve, reject) => {
  // If it is successful it returns the formatted data
  Pokemon.findOne({ include: [Type], where: { name: name } })
    .then(response => response !== null ? resolve(dataDB(response)) : resolve(null))
    .catch(err => reject(err))
})

const getAllItems = () => new Promise((resolve, reject) => {
  const limit = 3 // Limit of items to get from API
  Pokemon.findAll({ include: [Type] }) // Get data from DB
    .then(response => {
      const items = response.map(item => dataDB(item))// Format the array for the concatenate after
      // Generate array of promises
      const promises = []
      for (let i = 1; i <= limit; i++) {
        promises.push(itemAPIId(i))
      }
      Promise.all(promises).then(response => resolve(items.concat(response)))
    })
    .catch(err => reject(err))
})

const insert = (data, types) => new Promise((resolve, reject) => {
  Pokemon.create(data) // Insert item in DB
    .then(newData => {
      Promise.all(types.map(name => Type.findByPk(name))) // Search types in DB
        .then(types => {
          newData.setTypes(types) // Set new data with types
          resolve(itemDBName(data.name)) // If it is successful it returns the formatted data
        })
    })
    .catch(err => reject(err))
})

module.exports = {
  getAllItems,
  insert,
  itemAPIId,
  itemAPIName,
  itemDBId,
  itemDBName,
  saveTypes
}
