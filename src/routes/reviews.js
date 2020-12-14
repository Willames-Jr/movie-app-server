const controller = require('../controllers/ReviewController');
const validateToken = require('../utils/utils').validateToken;

module.exports = (router) => {
    router.route('/user-reviews/:writer')
    .get(controller.indexByWriter)
    .post(validateToken,controller.add);

    router.route('/reviews/:_id?')
    .get(controller.index)
    .put(validateToken,controller.update)
    .delete(validateToken,controller.delete);
}