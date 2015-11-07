var Calendar = require('../models/calendar.js');
var config = require('../../../../config/config.js');

var google = require('googleapis');
var googleAuth = require('google-auth-library');


module.exports = function(socket){

  socket.on('calendar/google/list', function(calendar, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    gCalendar.calendarList.list({
      auth: auth
    }, function(err, response){
      callback(err, response);
    });
  });

  socket.on('calendar/google/events', function(calendar, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    gCalendar.events.list({
      auth: auth,
      calendarId: calendar.calendarId,
      // timeMin: (new Date()).toISOString(),
      // maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if(err){ callback(err); return; }
      callback(null, response.items);
    });
  });
  socket.on('calendar/google/nextEvent', function(calendar, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    gCalendar.events.list({
      auth: auth,
      calendarId: calendar.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if(err){ callback(err); return; }
      if(response.items == null || response.items.length == 0){ callback("No event found"); return; }
      callback(null, response.items[0]);
    });
  });

  socket.on('calendar/google/events/year', function(calendar, callback){

    var now = new Date();

    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    
    function list(pageToken){
      gCalendar.events.list({
        auth: auth,
        calendarId: calendar.calendarId,
        timeMin: (new Date(now.getFullYear() -1, now.getMonth())).toISOString(),
        timeMax: (new Date(now.getFullYear() +1, now.getMonth())).toISOString(),
        pageToken: pageToken,
        maxResults: 1000,
        singleEvents: true,
        orderBy: 'startTime'
      }, function(err, response) {
        if(err){ callback(err); return; }
        socket.emit('calendar/google/events/year', calendar, response.items);
        if(response.nextPageToken != null){
          list(response.nextPageToken);
        }
      });
    }
    list();
  });



  socket.on('calendar/google/event/create', function(calendar, newEvent, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');

    gCalendar.events.insert({
      auth: auth,
      calendarId: calendar.calendarId,
      resource: newEvent
    }, callback);
  });

  socket.on('calendar/google/event/edit', function(calendar, event, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    gCalendar.events.get({
      auth: auth,
      calendarId: calendar.calendarId,
      eventId: event.googleEvent.id
    }, function(err, googleEvent){
      if(err){
        callback(err);
        return;
      }
      var keyToCheckIfChanged = {'summary': 'title', 'description': 'description', 'location': 'location', 'end':'nend', 'start':'nstart'};

      for(var googleKey in keyToCheckIfChanged){
        var eventKey = keyToCheckIfChanged[googleKey];
        if(event[eventKey] != null && googleEvent[googleKey] != event[eventKey]){
          googleEvent[googleKey] = event[eventKey];
        }
      } 
      gCalendar.events.update({
        auth: auth,
        calendarId: calendar.calendarId,
        eventId: event.googleEvent.id,
        resource: googleEvent
      }, function(err, res){
        callback(err, res);
      });
    });
  });
  
  socket.on('calendar/google/event/delete', function(calendar, event, callback){
    var auth = getAuth(calendar);
    if(auth == null){ callback(new Error("Calendar auth error")); return }
    var gCalendar = google.calendar('v3');
    gCalendar.events.get({
      auth: auth,
      calendarId: calendar.calendarId,
      eventId: event.googleEvent.id
    }, function(err, googleEvent){
      if(err){
        callback(err);
        return;
      }
      gCalendar.events.delete({
        auth: auth,
        calendarId: calendar.calendarId,
        eventId: event.googleEvent.id
      }, callback);
    });
  });

function getAuth(calendar){
  if(calendar.type != "google") return null;
  var clientID = calendar.clientId;
  var clientSecret = calendar.clientSecret;
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientID, clientSecret, config.url+"/calendar/auth/google/callback");
  oauth2Client.setCredentials({
    "access_token": calendar.accessToken,
    "refresh_token": calendar.refreshToken
  });
  return oauth2Client;
}

}