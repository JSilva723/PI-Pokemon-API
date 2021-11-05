const { DBService } = require('../services/db');
const { APIService } = require('../services/api');
const db = new DBService();
const api = new APIService();

const _items = (end) => new Promise((resolve, reject) => {
  // This function returns an array to be fragmented
  db.getAllItems() // Get items to db
    .then(itemsDB => {
      if (itemsDB.length > end) {
        resolve(itemsDB);
      } else {
        end = end - itemsDB.length;
        api.getAllItems(end)
        .then(itemsAPI => resolve(itemsDB.concat(itemsAPI))) // Return all items from DB and some items from API
        .catch(err => reject(err));
      }
    })
    .catch(err => reject(err));
});

const getItems = (start, end) => new Promise((resolve, reject) => {
  if (start === 1) start = 0; // Set the start, is 1 to start, because first item to the API have id=1
  _items(end)
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
        .then(item => resolve(item)) // Return the item
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const getTypes = () => new Promise((resolve,reject) => {
  // This function load the types table when start the server, if the table is empty
  db.getTypes() // Check if there is values in DB
    .then(response => {
      if (response.length === 0) {
        api.getTypeNames() // Get types from API
          .then(names => db.saveTypeNames(names)) // Save in DB
          .then(() => {
            db.getTypes()
              .then(response => resolve(response));
          })
          .catch(err => reject(err)); 
      } else {
        resolve(response);
      }
    })
    .catch(err => reject(err)); 
});

module.exports = {
  getTypes,
  getItems,
  getItemByName,
  getItemById,
  insert
};
