const mongoose = require("mongoose"),
    UserSchema = mongoose.Schema({
        userName: {
            type: String,
            unique: [true, 'User name already registered.'],
            required: [true, 'User name is Require'],
        },
        name: {
            type: String,
        },
        twitterProvider: {
            type: Object,
            required: [true, 'twitterProvider is Require'],
        },
    }, {
        timestamps: true
    });
// Export User Schema
module.exports = mongoose.model('User', UserSchema);