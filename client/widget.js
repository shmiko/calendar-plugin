module.exports = function(plugin){

  function NextEvent($scope, socket){
    $scope.calendar = null;
    $scope.nextEvent = null;
    socket.emit('calendar/get', $scope.widget.settings.calendar, function(err, calendar){
      if(err){
        console.error(err);
        return;
      } 
      $scope.calendar = calendar;
      socket.emit('calendar/google/nextEvent', calendar, function(err, event){
        if(err){
          console.error(err);
          return;
        } 
        $scope.nextEvent = event;
        var start = event.start.dateTime ? moment(event.start.dateTime) : moment(event.start.date);
        var format = event.start.dateTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY";
        var iscurrentDate = start.isSame(new Date(), "day");
        if(iscurrentDate){
          format = event.start.dateTime ? "HH:mm" : 'Today'
        }
        $scope.nextEvent.startDate = start.format(format); 
      })

    })
  }

  function NextEventConfig($scope, socket, $element, toaster){
    if($scope.widget.colWidth == null)
      $scope.widget.colWidth = 3;
    if($scope.widget.settings == null)
      $scope.widget.settings = {};

    $scope.calendars = [];  
    var calendarsById = {};  
    socket.emit('calendar/list', function(err, list){
      if(err) return;
      for(var i in list){
        calendarsById[list[i]._id] = list[i];
      }
      $scope.calendars = list;
    });

    $scope.getCalendarById = function(id){
      return calendarsById[id];
    }

    $scope.save = function(){
      socket.emit('widget/save', $scope.widget, function(err){
        if(err){
          toaster.pop('error', 'Error', 'Error on saving the widget');
          console.error(err);
        }else{
          toaster.pop('Info', 'Widget', 'Widget saved');
        }
      });
    }

    $scope.delete = function(){
      if($scope.widget._id == null){
        $element.remove();
        return
      }
      socket.emit('widget/delete', $scope.widget, function(err){
        if(err) {
          toaster.pop('error', 'Error', 'Error on deleting the widget');
          console.error(err);
          return;
        }
        $element.remove();
      }); 
    }
  }

  plugin.registerWidget("nextEvent", "nextEvent.html", NextEvent, NextEventConfig)

}