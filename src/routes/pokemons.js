const pokemons = require('express').Router()
const { getAllItems, insert, itemAPIId, itemAPIName, itemDBId, itemDBName } = require('../utils/index')

pokemons.get('/', (req, res, next) => {
  const { name } = req.query
  // Verify if name arrives for queries
  if (!name) {
    getAllItems() // Get all items
      .then(items => res.send(items))
      .catch(err => next(err))
  } else {
    itemDBName(name) // Search in DB
      .then(item => {
        if (item === null) {
          itemAPIName() // Search in the API
            .then(item => res.send(item))
            .catch(err => next(err))
        } else { res.send(item) }
      })
      .catch(err => next(err))
  }
})

pokemons.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (id.length < 4) {
    itemAPIId(id) // Search in API
      .then(item => res.send(item))
      .catch(err => next(err))
  } else {
    itemDBId(id) // Search in DB
      .then(item => res.send(item))
      .catch(err => next(err))
  }
})

pokemons.post('/', async (req, res, next) => {
  const { name, hp, attack, defense, speed, height, weight, types, img } = req.body
  // Generate item with the data from body
  const data = { name, hp, attack, defense, speed, height, weight, img }
  insert(data, types)
    .then(item => res.send(item))
    .catch(err => next(err))
})

module.exports = pokemons
