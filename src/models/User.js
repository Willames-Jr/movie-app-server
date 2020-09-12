const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://i0.wp.com/ipc.digital/wp-content/uploads/2016/07/icon-user-default.png?fit=462%2C462&ssl=1"
    }
});

module.exports = mongoose.model('users',userSchema);