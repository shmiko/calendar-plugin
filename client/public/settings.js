(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, $location, $routeParams, toaster){
  if($routeParams.id == null){
    $location.path('/settings/calendar'); return;
  }
  
  $scope.calendar = {};
  $scope.calendars = [];
  var calendarById = {};
  var calendarId = $routeParams.id;

  socket.emit('calendar/get', calendarId , function(err, calendar){
    if(err){ $location.path('/settings/calendar'); return; }
    $scope.calendar = calendar;
    if($scope.calendar.calendarId == null) $scope.calendar.calendarId = null;
    socket.emit('calendar/google/list', calendar, function(err, response){
      if(err){
        toaster.pop('error', 'Error', 'Cannot list google calendars');
        console.error(err);
        return;
      }
      for(var i in response.items){
        var item = response.items[i];
        $scope.calendars.push(item);
        calendarById[item.id] = item;
      }
    });
  });

  $scope.save = function(){
    $scope.calendar.color = document.querySelector('.colorpicker').value;
    if($scope.calendar.calendarId != 'primary')
      $scope.calendar.accessRole = calendarById[$scope.calendar.calendarId].accessRole;
    else
      $scope.calendar.accessRole = 'owner'
    socket.emit('calendar/save', $scope.calendar, function(err){
      if(err){ console.error(err); return; }
      $location.path('/settings/calendar');
    });
  }

}
},{}],2:[function(require,module,exports){
module.exports = function($scope, socket, $location, $routeParams, toaster){

  $scope.calendars = [];

  socket.emit("calendar/list", function(err, list){
    if(err) return;
    $scope.calendars = list;
  });


  $scope.edit = function(calendar){
    if(calendar.type == "google"){
      $location.path('/settings/calendar/google/edit/' + calendar._id);

    }
  }

  $scope.delete = function(calendar){
    socket.emit('calendar/delete', calendar, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Cannot delete this calendar'); 
        return;
      }

      var index = -1;
      for(var i in $scope.calendars){
        var scopeCalendar = $scope.calendars[i];
        if(scopeCalendar._id == calendar._id){
          index = i;
        }
      }
      if(index > -1){
        $scope.calendars.splice(index, 1);
      }

    });
  }

}
},{}],3:[function(require,module,exports){
var settings = getPlugin("calendar").settings;


settings.registerController("CalendarListController", require('./controller/calendarList'));
settings.registerController("CalendarGoogleViewController", require('./controller/calendarGoogleView'));

settings.registerRoute('/calendar',{
  controller :  'CalendarListController',
  templateUrl :  'index.html'
});
settings.registerRoute('/calendar/google/edit/:id',{
  controller :  'CalendarGoogleViewController',
  templateUrl :   'google/view.html'
});


settings.registerSettingsItem('Calendar', '/calendar', 'fa-calendar');
},{"./controller/calendarGoogleView":1,"./controller/calendarList":2}]},{},[3])