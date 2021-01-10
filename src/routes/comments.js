const controller = require('../controllers/CommentController');
const validateToken = require('../utils/utils').validateToken;

module.exports = (router) =>{
    router.route('/comments/:review')
    .get(controller.indexComments)
    .post(validateToken,controller.addComment);

    router.route('/comments/:comment_id')
    .delete(validateToken,controller.removeComment)
    .put(validateToken,controller.updateComment);

    router.route('/like/comment')
    .put(validateToken,controller.addRemoveCommentLike);

    router.route('/dislike/comment')
    .put(validateToken,controller.addRemoveCommentDislike);

    router.route('/like/response')
    .put(validateToken,controller.addRemoveResponseLike);

    router.route('/dislike/response')
    .put(validateToken,controller.addRemoveResponseDislike);

    router.route('/responses/:respond')
    .get(controller.indexResponses);

    router.route('/responses/:response_id?')
    .post(validateToken,controller.addResponse)
    .put(validateToken,controller.updateResponse)
    .delete(validateToken,controller.removeResponse);
}
