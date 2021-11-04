require('dotenv').config();
const axios = require('axios');
axios.defaults.baseURL = process.env.BASE_URL // eslint-disable-line

module.exports = { axios };
