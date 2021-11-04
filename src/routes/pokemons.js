const pokemons = require('express').Router();
const { getItems, getItemByName, getItemById, insert } = require('../utils/index');

pokemons.get('/', (req, res, next) => {
  const { name, start, end } = req.query;
  if (name) {
    getItemByName(name)
      .then(item => res.send(item))
      .catch(err => next(err));
  } else {
    getItems(parseInt(start), parseInt(end)) // Send numbers
      .then(items => res.send(items))
      .catch(err => next(err));
  }
});

pokemons.get('/:id', (req, res, next) => {
  const id = req.params.id;
  getItemById(id)
    .then(item => res.send(item))
    .catch(err => next(err));
});

pokemons.post('/', (req, res, next) => {
  const { name, hp, attack, defense, speed, height, weight, types, img } = req.body;
  // Generate item with the data from body
  const data = { name, hp, attack, defense, speed, height, weight, img };
  insert(data, types)
    .then(item => res.send(item))
    .catch(err => next(err));
});

module.exports = { pokemons };
