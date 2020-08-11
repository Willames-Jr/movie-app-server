const controller = require('../controllers/UserController');
const validateToken = require('../utils/utils').validateToken;

module.exports = (router) => {
    router.route('/users/:id')
    .delete(validateToken,controller.delete)
    .put(validateToken,controller.update);


    router.route('/register')
    .post(controller.register);

    router.route('/login')
    .post(controller.login);
}