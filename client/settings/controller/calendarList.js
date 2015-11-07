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