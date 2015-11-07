var Calendar = require('./models/calendar.js');


module.exports = function(app, passport){

  app.get('/calendar/auth/google',
            passport.authorize('gcalendar-login', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'https://www.googleapis.com/auth/calendar'], accessType: 'offline', approvalPrompt: 'force' }));

  app.get('/calendar/auth/google/callback', 
    passport.authorize('gcalendar-login', { failureRedirect: '#/settings/calendar' }),
    function(req, res) {
      res.redirect('save/' + req.account._id);
    });

  app.get('/calendar/auth/google/save/:id', function(req, res){
    Calendar.findById(req.param('id'), function(err, calendar){
      if(err){
        res.redirect('../../../../#/settings/calendar');
      }else{
        calendar.user = req.user;
        calendar.save(function(err, saved){
          res.redirect('../../../../#/settings/calendar');    
        });
      }
      
    });
  })
}