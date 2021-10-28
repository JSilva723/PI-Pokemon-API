const pokemons = require('express').Router()
const { getAllItems, getItemByName, getItemById } = require('../utils/index')
const { DBService } = require('../services/db')
const db = new DBService()

pokemons.get('/', (req, res, next) => {
  const { name } = req.query
  // Verify if name arrives for queries
  if (!name) {
    getAllItems() // Get all items
      .then(items => res.send(items))
      .catch(err => next(err))
  } else {
    getItemByName(name) // Get one item
      .then(item => res.send(item))
      .catch(err => next(err))
  }
})

pokemons.get('/:id', (req, res, next) => {
  const id = req.params.id
  getItemById(id) // Search in DB
    .then(item => res.send(item))
    .catch(err => next(err))
})

pokemons.post('/', async (req, res, next) => {
  const { name, hp, attack, defense, speed, height, weight, types, img } = req.body
  // Generate item with the data from body
  const data = { name, hp, attack, defense, speed, height, weight, img }
  db.insert(data, types)
    .then(item => res.send(item))
    .catch(err => next(err))
})

module.exports = { pokemons }
