const types = require('express').Router()
const { Type } = require('../db/models/Type')
const { DBService } = require('../services/db')
const db = new DBService()

types.get('/', (_req, res, next) => {
  db.getAllItems(Type) // Get all types in DB
    .then(response => res.json(response))
    .catch(err => next(err))
})

module.exports = { types }
