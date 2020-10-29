const controller = require('../controllers/ListsController');
const validateToken = require('../utils/utils').validateToken;

module.exports = (router) => {

    router.route('/lists/:id/:list_id')
    .get(validateToken,controller.searchList);

    router.route('/lists/:id')
    .get(controller.index)
    .post(validateToken,controller.createList)
    .put(validateToken,controller.updateList)
    .delete(validateToken,controller.deleteList);


    router.route('/lists/movie/:id')
    .post(validateToken,controller.addMovie)
    .delete(validateToken,controller.deleteMovie);

}