const User = require('../models/User');
const MovieList = require('../models/MovieList');

module.exports = {
    index: (req, res) => {
        const { id } = req.params;

        MovieList.find({ creator: id }).populate('creator').then((movieLists) => {
            res.status(200).send({ results: movieLists });
        }).catch((err) => {
            res.status(500).send({ error: err });
        });
    },
    searchList: (req,res) => {
        const payload = req.decoded;
        const { id,list_id } = req.params;

        if (payload.userId == id) {
            MovieList.findById({ _id: list_id }).populate('creator').then((movieLists) => {
                res.status(200).send({ results: movieLists });
            }).catch((err) => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
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
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    updateList: (req, res) => {
        const { list_id, name } = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        let errors = [];

        if (!name || typeof name == undefined || name == null) {
            errors.push({ error: 'Name cannot be empty' });
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
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    deleteList: (req,res) => {
        const { list_id } = req.body;
        const { id } = req.params;
        const payload = req.decoded;

        if (payload.userId == id) {
            MovieList.deleteOne({_id: list_id}).then(() => {
                res.sendStatus(204);
            }).catch((err) => {
                res.status(500).send({error:err});
            });
        } else {
            res.status(401).send({ error: 'You must be logged in with your account' });
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
            res.status(401).send({ error: 'You must be logged in with your account' });
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
            console.log(payload.userId);
            console.log(id)
            res.send({ error: 'You must be logged in with your account' });
        }
    }
}