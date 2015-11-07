var Calendar = require('./models/calendar.js');
var config = require('../../../config/config.js');
module.exports = function(passport){
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var GOOGLE_CLIENT_ID = config.google.auth.clientID;
  var GOOGLE_CLIENT_SECRET = config.google.auth.clientSecret;
  if(GOOGLE_CLIENT_ID != null && GOOGLE_CLIENT_ID.length > 1 && GOOGLE_CLIENT_SECRET != null && GOOGLE_CLIENT_SECRET.length > 1){

    Calendar.googleLoginEnable = true;
    
    passport.use('gcalendar-login', new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: config.url+"/calendar/auth/google/callback"
    }, function(accessToken, refreshToken, profile, done) {
        var email = profile.emails[0].value;

        var calendar = new Calendar({
          type: 'google',
          email: email,
          name: "gcalendar " + email,
          googleId: profile.id,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          accessToken: null,
          refreshToken: refreshToken,
          calendarId: 'primary',
          accessRole: 'owner',
          color: "#f0f0f0"
        });
        
        calendar.save(function(err, calendarSaved){
          done(err, calendarSaved);
        });    
      }
    ));
  }
}