const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../configs/configs')[environment];

module.exports = {
    register: (req, res) => {
        const { name, password, avatar } = req.body;

        const user = new User({ name, password, avatar });

        User.findOne({ name }).then(userFind => {
            if (!userFind) {
                bcrypt.hash(user.password, stage.saltingRounds, (err, hash) => {
                    if (err) {
                        console.log('Error hashing user password');
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
                res.status(200).send({ message: "This username is already in use" });
            }
        }).catch(err => {
            res.status(500).send({ error: err });
        });

    },
    login: (req, res) => {
        const { name, password } = req.body;

        User.findOne({ name }).then(user => {

            if (user) {
                bcrypt.compare(password, user.password).then(match => {

                    let result = {};
                    let status = 200;

                    if (match) {

                        const payload = { user: user.name, userAvatar: user.avatar , userId: user._id};
                        const options = { expiresIn: '2d' };
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        result.status = status;
                        result.token = token;
                        result.result = user;
                    } else {
                        status = 401;
                        result.message = 'Invalid password';
                    }

                    res.status(status).send(result);

                }).catch(err => {
                    res.status(401).send({ error: err });
                });
            } else {
                res.status(400).send({message: 'Invalid name'});
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
            res.status(401).send({ message: 'You must be logged in' })
        }

    },
    update: (req, res) => {
        const { name, avatar } = req.body;

        const {id} = req.params;

        const payload = req.decoded;

        if (payload.userId == id) {
            User.updateOne({ name: payload.user }, { name, avatar }).then(user => {
                res.status(200).send(user);
            }).catch(err => {
                res.status(500).send({ error: err });
            });
        } else {
            res.status(401).send({ message: 'You must be logged in' })
        }
    }
}