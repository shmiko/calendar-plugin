// load thImape things we need
var mongoose = require('mongoose');
var User = require('../../../../models/user');
var Schema = mongoose.Schema

// define the schema for our user model
var calendarSchema = mongoose.Schema({
        name: String,
        email: String,
        color: String,
        type: {type: String, default: 'intern'},
        clientId: String,
        clientSecret: String,
        accessToken: String,
        refreshToken: String,
        googleId: String,
        calendarId: String,
        accessRole: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Calendar', calendarSchema);
module.googleLoginEnable = false;
