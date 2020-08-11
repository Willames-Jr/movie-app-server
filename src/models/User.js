const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fipc.digital%2Ficon-user-default%2F&psig=AOvVaw2wN5z187BXXUdvZbIxM7f2&ust=1597255894805000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLiG0_jfk-sCFQAAAAAdAAAAABAD"
    }
});

module.exports = mongoose.model('users',userSchema);