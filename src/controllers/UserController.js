const User = require('../models/User');
const MovieList = require('../models/MovieList');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;

module.exports = {
    index: (req, res) => {

        const payload = req.decoded;

        User.findById(payload.userId)
            .then(user => {
                res.status(200).send(user);
            }).catch(err => {
                res.status(500).send({ error: err });
            });

    },
    register: (req, res) => {
        const { email, name, password, avatar } = req.body;

        let errors = [];

        if (!name || typeof name == undefined || name == null) {
            errors.push({ error: 'Name cannot be empty' });
        }
        if (!password || typeof password == undefined || password == null) {
            errors.push({ error: 'Password cannot be empty' });
        } else if (password.length < 6) {
            errors.push({ error: 'Password must be longer than 5 characters' });
        }
        if (!email || typeof email == undefined || email == null) {
            errors.push({ error: 'Email cannot be empty' });
        } else if (!email.includes('@') || !email.includes('.com')) {
            errors.push({ error: 'Invalid email' });
        }

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        const user = new User({ email, name, password, avatar });

        User.findOne({ email }).then(userFind => {
            if (!userFind) {
                bcrypt.hash(user.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send({ error: err });
                    } else {
                        user.password = hash;
                        user.save().then(user => {
                            res.status(201).send(user);
                        }).catch(err => {
                            res.status(500).send({ error: err });
                        });
                    }
                });
            } else {
                res.status(400).send({ message: "This email is already being used" });
            }
        }).catch(err => {
            res.status(500).send({ error: err });
        });

    },
    login: (req, res) => {

        const { email, password } = req.body;

        let errors = [];

        if (!password || typeof password == undefined || password == null) {
            errors.push({ error: 'Password cannot be empty' });
        }
        if (!email || typeof email == undefined || email == null) {
            errors.push({ error: 'Email cannot be empty' });
        } else if (!email.includes('@') || !email.includes('.com')) {
            errors.push({ error: 'Invalid email' });
        }

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        User.findOne({ email }).then(user => {

            if (user) {
                bcrypt.compare(password, user.password).then(match => {

                    let result = {};
                    let status = 200;

                    if (match) {

                        const payload = { user: user.name, userAvatar: user.avatar, userId: user._id };
                        const options = { expiresIn: '2d' };
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        result.status = status;
                        result.token = token;
                        result.result = user;
                    } else {
                        status = 401;
                        result.error = 'invalid password';
                    }

                    res.status(status).send(result);

                }).catch(err => {
                    res.status(401).send({ error: err });
                });
            } else {
                res.status(400).send({ error: 'Invalid email' });
            }

        }).catch(err => {
            res.status(500).send({ error: err });
        });
    },
    delete: (req, res) => {
        const { id } = req.params;

        const payload = req.decoded;

        if (payload.userId = id) {
            User.deleteOne({ _id: id }).then(() => {
                res.status(204).send();
            }).catch(err => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'You must be logged in with your account' });
        }

    },
    update: (req, res) => {
        const { name, avatar } = req.body;

        const { id } = req.params;

        const payload = req.decoded;

        if (payload.userId == id) {
            User.updateOne({ name: payload.user }, { name, avatar }).then(user => {
                res.status(200).send(user);
            }).catch(err => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    }
}