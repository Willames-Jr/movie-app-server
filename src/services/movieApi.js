const axios = require('axios');
const key = process.env.MDB_KEY

const movieApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params:{
        api_key: key,
        language: "en-US"
    },
    validateStatus: status =>  {
        return status; // default
    },
});

module.exports = movieApi;