const routes = require('express').Router();
const { pokemons } = require('./pokemons');
const { types } = require('./types');
const handleErrors = require('./handleErrors');

routes.use('/pokemons', pokemons); // Routes of pokemons
routes.use('/types', types); // Route of type
routes.use((_req, res) => res.status(404).json('Not found'));
routes.use(handleErrors); // Error catching endware.

module.exports = { routes };
