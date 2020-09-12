const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieListSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    movies: {
        type: [String]
    }
});

module.exports = mongoose.model('movie-lists',movieListSchema);