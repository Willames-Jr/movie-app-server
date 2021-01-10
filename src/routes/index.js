const users = require('./users');
const reviews = require('./reviews');
const lists = require('./lists');
const comments = require('./comments');

module.exports = (router) => {
    users(router);
    reviews(router);
    lists(router);
    comments(router);
    return router;
}