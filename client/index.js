var plugin = getPlugin("calendar");

plugin.registerController('CalendarController', require('./controllers/calendar.js'));

plugin.registerRoute('/calendar', {
  templateUrl: "index.html",
  controller:"CalendarController" 
});

plugin.registerMenuItem('Calendar', '/calendar', 'fa-calendar');


require('./widget.js')(plugin);