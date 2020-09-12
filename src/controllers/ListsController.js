const User = require('../models/User');
const MovieList = require('../models/MovieList');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../configs/configs')[environment];

module.exports = {
    index: (req, res) => {
        const { id } = req.params;

        MovieList.find({ creator: id }).populate('creator').then((movieLists) => {
            res.status(200).send({ results: movieLists });
        }).catch((err) => {
            res.status(500).send({ error: err });
        });
    },  
    createList: (req, res) => {
        const { list_name } = req.body;
        const payload = req.decoded;
        const { id } = req.params;

        if (payload.userId == id) {
            const movieList = new MovieList({ name: list_name, creator: id });
            movieList.save().then(() => {
                res.sendStatus(201);
            }).catch((err) => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'Você deve estar logado com sua conta' });
        }
    },
    updateList: (req, res) => {
        const { list_id, name } = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        let errors = [];

        if (!name || typeof name == undefined || name == null) {
            errors.push({ error: 'O nome não pode estar vazio' });
        }

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        if (payload.userId == id) {
            MovieList.updateOne({ _id: list_id }, { name }).then((newList) => {
                res.status(200).send(newList);
            }).catch((err) => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'Você deve estar logado com sua conta' });
        }
    },
    deleteList: (req,res) => {
        const { list_id} = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        if (payload.userId == id) {
            MovieList.deleteOne({_id: list_id}).then(() => {
                res.sendStatus(204);
            }).catch((err) => {
                res.status(500).send({error:err});
            });
        } else {
            res.status(401).send({ error: 'Você deve estar logado com sua conta' });
        }
    },
    addMovie: (req, res) => {
        const { list_id, movie } = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        if (payload.userId == id) {
            MovieList.findById({ _id: list_id }).then((movieList) => {
                const newList = movieList.movies;
                newList.push(movie);
                MovieList.updateOne({ _id: list_id }, { movies: newList }).then((newList) => {
                    res.status(200).send(newList);
                }).catch((err) => {
                    res.status(500).send({ error: err });
                });
            }).catch((err) => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'Você deve estar logado com sua conta' });
        }
    },
    deleteMovie: (req,res) => {
        const { list_id, movie } = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        if (payload.userId == id) {
            MovieList.findById({ _id: list_id }).then((movieList) => {
                const newList = movieList.movies;
                newList.remove(movie);
                MovieList.updateOne({ _id: list_id }, { movies: newList }).then((newList) => {
                    res.sendStatus(204);
                }).catch((err) => {
                    res.status(500).send({ error: err });
                });
            }).catch((err) => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'Você deve estar logado com sua conta' });
        }
    }
}