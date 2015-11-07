var gulp  = require('gulp');
var browserify = require('gulp-browserify');
var gettext = require('gulp-angular-gettext');
var concat = require('gulp-concat');
var rename = require("gulp-rename");


gulp.task("client-browserify", function(){
  gulp.src('client/index.js')
    .pipe(browserify())
    .on('error', onError)
    .pipe(gulp.dest('client/public/'));
});

gulp.task("settings-browserify", function(){
  gulp.src('client/settings/index.js')
    .pipe(browserify())
    .on('error', onError)
    .pipe(rename('settings.js'))
    .pipe(gulp.dest('client/public/'));
})


gulp.task('pot', function () {
  return gulp.src(['client/views/**/*.html', 'client/settings/views/**/*.html'])
  .pipe(gettext.extract('app.pot', {}))
  .on('error', onError)
  .pipe(gulp.dest('./locales/'));
});

gulp.task('translations', function () {
  return gulp.src('locales/**/*.po')
  .pipe(gettext.compile({
    module: 'dbapp'
  }))
  .pipe(concat('all.js'))
  .on('error', onError)
  .pipe(gulp.dest('locales/translations/'));


});

function onError(err) {
  console.error(err);
  this.emit('end');
}


gulp.task('default', ['no-watch'], function(){
  gulp.watch(['app.js', '**/*.js', '!public/**/*.js'], ['client-browserify', "settings-browserify"]);
  gulp.watch(['**/views/**/*.html'], ['pot']);
  gulp.watch(['locales/**/*.po'], ['translations']);
})

gulp.task('no-watch', ['pot', 'translations', 'client-browserify', "settings-browserify"]);
