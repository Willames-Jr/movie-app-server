require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const mongoose = require('mongoose');
const cors = require('cors');
const environment = process.env.NODE_ENV; // development
const connUri = process.env.MONGO_LOCAL_URL;
const stage = require('./configs/configs')[environment];

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true }).then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Error on conecting to database');
    console.log('And error is this: ' + err);
});

app.use('/api/v1', routes(router));

if (environment !== 'production') {
    app.use(logger('dev'));
}

app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;