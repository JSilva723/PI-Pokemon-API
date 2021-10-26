const router = require('express').Router()
const pokemons = require('./pokemons')
const types = require('./types')
const handleErrors = require('./handleErrors')

router.use('/pokemons', pokemons) // Routes of pokemons
router.use('/types', types) // Route of type
router.use((_req, res) => res.status(404).json('Not found'))
router.use(handleErrors) // Error catching endware.

module.exports = router
