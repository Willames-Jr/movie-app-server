const controller = require('../controllers/ReviewController');
const validateToken = require('../utils/utils').validateToken;

module.exports = (router) => {
    router.route('/reviews/:writer')
    .post(validateToken,controller.add);

    router.route('/reviews/')
    .get(controller.index)
    .put(validateToken,controller.update)
    .delete(validateToken,controller.delete);
}