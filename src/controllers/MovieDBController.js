const movieApi = require('../services/movieApi');

module.exports = {
    getPopularMovies: (req,res) => {
        const page  = req.query.page;

        movieApi.get('discover/movie',{params: {page: page, include_adult:false}})
        .then((response) => {
            res.status(200).send(response.data);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({error: err});
        });
    },

    getUpcomingMovies: (req,res) => {
        const page  = req.query.page;

        movieApi.get('discover/movie',{params: {page: page}})
        .then((response) => {
            res.status(200).send(response.data);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({error: err});
        });
    },

    getTopMovies: (req,res) => {
        const page  = req.query.page;

        movieApi.get('discover/movie',{params: {page: page}})
        .then((response) => {
            res.status(200).send(response.data);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({error: err});
        });
    },
    searchByName: (req,res) => {
        const {page,query}  = req.query;

        movieApi.get('search/movie',{
        params: {
            page: page,
            include_adult: false,
            query: query
            }
        })
        .then((response) => {
            res.status(200).send(response.data);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({error: err});
        });
    }
}