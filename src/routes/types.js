const types = require('express').Router()
const Type = require('../db/models/Type')

types.get('/', (_req, res, next) => {
  Type.findAll() // Get all types in DB
    .then(response => res.json(response))
    .catch(err => next(err))
})

module.exports = types
