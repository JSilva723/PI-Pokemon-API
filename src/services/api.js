const { axios } = require('../../axios.config');

function APIService () { }

APIService.prototype.formatDetail = (obj) => ({
  // Format the data with the necessary attributes
  id: obj.id,
  name: obj.name,
  height: obj.height,
  weight: obj.weight,
  img: obj.sprites.front_default,
  type: obj.types.map(obj => (obj.type.name)),
  hp: obj.stats[0].base_stat,
  attack: obj.stats[1].base_stat,
  defense: obj.stats[2].base_stat,
  speed: obj.stats[5].base_stat
});

APIService.prototype.formatMain = (obj) => ({
  // Format the data with the necessary attributes
  name: obj.name,
  img: obj.sprites.front_default,
  type: obj.types.map(obj => (obj.type.name))
});

APIService.prototype.getItemById = function (id) {
  return new Promise((resolve, reject) => {
    // If it is successful it returns the formatted data
    axios.get(`/pokemon/${id}`)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
};

APIService.prototype.getItemByName = function (name) {
  return new Promise((resolve, reject) => {
    // If it is successful it returns the formatted data
    axios.get(`/pokemon/${name}`)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
};

APIService.prototype.getAllItems = function (start, end) {
  // The limit is required for the proyect
  return new Promise((resolve, reject) => {
    const promises = [];
    // Generate array of promises
    for (let i = start; i < end; i++) {
      promises.push(this.getItemById(i));
    }
    Promise.all(promises) // If it is successful returns the array with items from API
      .then(response => resolve((response)))
      .catch(err => reject(err));
  });
};

APIService.prototype.getTypeNames = () => new Promise((resolve, reject) => {
  axios.get('/type')
    .then(response => {
      // Whit the response from API, generate array of names
      const names = response.data.results.map(type => (type.name));
      resolve(names);
    })
    .catch(err => reject(err));
});

module.exports = { APIService };
