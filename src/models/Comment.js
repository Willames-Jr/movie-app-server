const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Response = require('../models/Response');

const commentSchema = new Schema({
    writer:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    review:{
        type: Schema.Types.ObjectId,
        ref: "reviews",
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

commentSchema.post('remove', (doc) =>{
    // doc will be the removed Person document
    console.log(doc)
    Response.remove({_id: { $in: doc.responses }})
});

module.exports = mongoose.model('comments',commentSchema);