const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    movie:{
        type: String,
        required: true
    },
    rate:{
        type: Number,
        required: true,
        min: 0.5,
        max: 10
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

}); 

module.exports = mongoose.model('reviews',reviewSchema);