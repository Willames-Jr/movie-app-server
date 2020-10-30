require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const mongoose = require('mongoose');
const cors = require('cors');
const localConnUri = process.env.MONGO_LOCAL_URL;
const serverConnUri = process.env.MONGO_URL;
const environment = process.env.NODE_ENV;
const databaseUri = environment === 'development' ? localConnUri : serverConnUri;

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(databaseUri, { useNewUrlParser: true }).then(() => {
    console.log(`Connected to database ${databaseUri}`);

}).catch((err) => {
    console.log('Error on connecting to database');
    console.log('And error is this: ' + err);
});
app.use(logger('dev'));


app.use('/api/v1', routes(router));



app.listen(process.env.PORT || 5000, () => {
    console.log('Server now is running');
});

module.exports = app;