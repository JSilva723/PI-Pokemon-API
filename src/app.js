const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes/index.js')
const server = express()

server.use(cors()) // Allow everyone to share resources
server.use(express.json()) // Acept format JSON in requests
server.use(morgan('dev')) // Log info in consola
server.use(routes) // Routes

module.exports = server
