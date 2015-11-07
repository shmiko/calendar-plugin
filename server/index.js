var Calendar = require('./models/calendar.js');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


module.exports = function(socket){
  
  socket.on('calendar/list', function(callback){
    Calendar.find({user:socket.request.user}, callback);
  });

  socket.on('calendar/get', function(id, callback){
    Calendar.findById(id, callback);
  });

  socket.on('calendar/delete', function(calendarP, callback){
    Calendar.findOneAndRemove({_id:calendarP._id, user:socket.request.user}, callback);
  });

  socket.on('calendar/save', function(calendar, callback){
    if(calendar._id == null){
      calendar.user = socket.request.user;
      Calendar.create(calendar, callback);
    }else{
      var id = calendar._id
      delete calendar._id;
      Calendar.update({_id:id}, calendar, {}, callback);
    }
  });

  require('./sockets/google')(socket);



}