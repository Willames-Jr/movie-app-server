const users = require('./users');
const reviews = require('./reviews');
const movies = require('./moviedb');

module.exports = (router) => {
    users(router);
    reviews(router);
    movies(router)
    return router;
}