const controller = require('../controllers/UserController');

module.exports = (router) => {
    router.route('/users')
    .post(controller.add);
}