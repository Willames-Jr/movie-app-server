const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../configs/configs')[environment];

module.exports = {
    register: (req, res) => {
        const { email,name, password, avatar } = req.body;

        let errors = [];

        if(!name || typeof name == undefined || name == null){
            errors.push({error: 'O nome não pode estar vazio'});
        }
        if(!password || typeof password == undefined || password == null){
            errors.push({error: 'A senha não pode estar vazia'});
        }else if(password.length < 6){
            errors.push({error: 'A senha deve possuir mais de 5 caracteres'});
        }
        if(!email || typeof email == undefined || email == null){
            errors.push({error: 'O email não pode estar vazio'});
        }else if(!email.includes('@') || !email.includes('.com')){
            errors.push({error: 'Email inválido'});
        }
        
        if(errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        const user = new User({ email,name, password, avatar });

        User.findOne({ email }).then(userFind => {
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
                res.status(400).send({ message: "Esse email já esta sendo usado" });
            }
        }).catch(err => {
            res.status(500).send({ error: err });
        });

    },
    login: (req, res) => {
        const { email, password } = req.body;

        let errors = [];

        if(!password || typeof password == undefined || password == null){
            errors.push({error: 'A senha não pode estar vazia'});
        }
        if(!email || typeof email == undefined || email == null){
            errors.push({error: 'O email não pode estar vazio'});
        }else if(!email.includes('@') || !email.includes('.com')){
            errors.push({error: 'Email inválido'});
        }

        if(errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        User.findOne({ email }).then(user => {

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
                        result.message = 'Senha inválida';
                    }

                    res.status(status).send(result);

                }).catch(err => {
                    res.status(401).send({ error: err });
                });
            } else {
                res.status(400).send({message: 'Email inválido'});
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
            res.status(401).send({ message: 'Você deve estar logado com sua conta' });
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
            res.status(401).send({ message: 'Você deve estar logado com sua conta' });
        }
    }
}