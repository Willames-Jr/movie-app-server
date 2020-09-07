const controller = require('../controllers/MovieDBController');

module.exports = (router) => {
    router.route('/movies/popular')
    .get(controller.getPopularMovies);

    router.route('/movies/upcoming')
    .get(controller.getUpcomingMovies);

    router.route('/movies/top_rated')
    .get(controller.getTopMovies);
}