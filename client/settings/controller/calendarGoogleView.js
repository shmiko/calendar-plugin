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