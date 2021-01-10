const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    writer:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    respond:{
        type: Schema.Types.ObjectId,
        ref: "comments",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    likes:{
        type: [Schema.Types.ObjectId],
        ref: "users"
    },
    dislikes:{
        type: [Schema.Types.ObjectId],
        ref: "users"
    },
    date:{
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('responses',responseSchema);