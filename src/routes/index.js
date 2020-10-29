const users = require('./users');
const reviews = require('./reviews');
const lists = require('./lists');

module.exports = (router) => {
    users(router);
    reviews(router);
    lists(router);
    return router;
}