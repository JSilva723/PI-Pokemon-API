const { Type } = require('../db/models/Type');
const { DBService } = require('../services/db');
const { APIService } = require('../services/api');
const db = new DBService();
const api = new APIService();

const _items = (start, end) => new Promise((resolve, reject) => {
  // This function returns an array to be fragmented
  db.getAllItems() // Get items to db
    .then(res => {
      const itemsDB = res.map(item => db.formatMain(item));
      if (end <= itemsDB.length) {
        resolve(itemsDB); // Return items from DB
      } else {
        if (itemsDB.length !== 0) start = itemsDB.length; // If have items in DB, start request from here
        api.getAllItems(start, end)
          .then(res => {
            const itemsAPI = res.map(item => api.formatMain(item));
            resolve(itemsDB.concat(itemsAPI)); // Return all items from DB and some items from API
          })
          .catch(err => reject(err));
      }
    })
    .catch(err => reject(err));
});

const getItems = (start, end) => new Promise((resolve, reject) => {
  if (start === 1) start = 0; // Set the start, is 1 to start, because first item to the API have id=1
  _items(start, end)
    .then(res => resolve(res.slice(start, end))) // Return the fragment of array necessary
    .catch(err => reject(err));
});

const getItemByName = (name) => new Promise((resolve, reject) => {
  // Search item by name
  api.getItemByName(name)
    .then(item => resolve(item))
    .catch(err => {
      if (err.response.status === 404) {
        db.getItemByName(name) // If item has not in the API, search in the DB
          .then(item => resolve(item))
          .catch(err => reject(err));
      } else {
        reject(err);
      }
    });
});

const getItemById = (id) => new Promise((resolve, reject) => {
  // Search item by id
  api.getItemById(id)
    .then(item => resolve(item))
    .catch(err => {
      if (err.response.status === 404) {
        db.getItemById(id) // If item has not in the API, search in the DB
          .then(item => resolve(item))
          .catch(err => reject(err));
      } else {
        reject(err);
      }
    });
});

const insert = (data, types) => new Promise((resolve, reject) => {
  db.insert(data, types) // Insert the item in DB
    .then(() => {
      db.getItemByName(data.name)
        .then(item => resolve(db.formatDetail(item))) // Return the item
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const saveTypes = () => {
  // This function load the types table when start the server, if the table is empty
  Type.findAll() // Check if there is values in DB
    .then(r => {
      if (r.length === 0) {
        api.getTypeNames() // Get types from API
          .then(names => db.saveTypeNames(names)) // Save in DB
          .catch(err => console.log(err)); // eslint-disable-line no-console
      }
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console
};

module.exports = {
  saveTypes,
  getItems,
  getItemByName,
  getItemById,
  insert
};
