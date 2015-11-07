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