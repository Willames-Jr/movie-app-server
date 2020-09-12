const users = require('./users');
const reviews = require('./reviews');
const movies = require('./moviedb');
const lists = require('./lists');

module.exports = (router) => {
    users(router);
    reviews(router);
    movies(router);
    lists(router);
    return router;
}