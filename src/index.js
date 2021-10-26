require('dotenv').config()
const server = require('./app.js')
const conn = require('./db/connection/index.js')
const { saveTypes } = require('./utils/index')
const PORT = process.env.PORT || 1234

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  console.log('Successful connection') // eslint-disable-line no-console
  saveTypes() // Get the types from api and save in the db
  server.listen(PORT, () => {
    console.log('Listening at %d', PORT) // eslint-disable-line no-console
  })
})
