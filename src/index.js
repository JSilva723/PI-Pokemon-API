require('dotenv').config()
const { app } = require('./app.js')
const { sequelize } = require('./db/connection/index.js')
const { saveTypes } = require('../src/utils/index')
const PORT = process.env.PORT || 1234

// Syncing all the models at once.
sequelize.sync({ force: false }).then(() => {
  console.log('Successful connection') // eslint-disable-line no-console
  saveTypes() // Get the types from api and save in the db
  app.listen(PORT, () => {
    console.log('Listening at %d', PORT) // eslint-disable-line no-console
  })
})
