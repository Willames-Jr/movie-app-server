const users = require('./users');
const reviews = require('./reviews');

module.exports = (router) => {
    users(router);
    reviews(router);
    return router;
}