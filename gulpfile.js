var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var scss = require('gulp-ruby-sass');
var del = require('del');
var cssmin = require('gulp-clean-css');

var THEME_ASSETS_PATH = path.join(__dirname, './content/themes/test-zh/assets');
var DIST_CSS = path.join(THEME_ASSETS_PATH, './dist/css/');
var DIST_JS = path.join(THEME_ASSETS_PATH, './dist/js/');
var SCSS_DIR = path.join(THEME_ASSETS_PATH, './scss');
console.log(DIST_CSS);

var libs = [
  'js/jQuery/jquery-1.11.3.min.js',
  'js/jQuery/jquery.cookie.js',
  'js/tipped.js',
  'js/application.js'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});

var css = [
  'loginDialog.css',
  'screen.css'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, '/css/', item);
});

var _css = [
  'screen.css',
  'app.css'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, '/css/', item);
});

var logins = [
  'js/login.js',
  'js/init.js'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});
var allJs = libs.concat(logins);
var _sourceFolders = 'js css scss'.split(' ');
var sourceFolder = {};

_sourceFolders.forEach(function (item) {
  sourceFolder[item] = path.join(THEME_ASSETS_PATH, item + '/');
});

gulp.task("scss", function () {
  return scss(path.join(sourceFolder.scss, '/index.scss'), {
      sourcemap: true
    })
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(sourceFolder.css)));
});

gulp.task('cssmin', ['scss'], function () {
   gulp.src(_css)
   .pipe(sourcemaps.init())
   .pipe(cssmin())
   .pipe(concat('index.min.css'))
   .pipe(sourcemaps.write())
   .pipe(gulp.dest(DIST_CSS));
});


gulp.task('scripts', function() {
  return gulp.src(allJs)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(DIST_JS)));
});

// Copy all static images
// gulp.task('images', ['clean'], function() {
//   return gulp.src(paths.images)
//     // Pass in options to the task
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(sourceFolder.js + '/*.js', ['scripts']);
  gulp.watch(SCSS_DIR + '/*.scss', ['scss', 'cssmin']);
  gulp.watch(sourceFolder.css + '/screen.css', ['scss', 'cssmin']);
  // console.log(sourceFolder.scss)
  // gulp.watch(sourceFolder.scss + '/*.scss', ['scss', 'cssmin']);
  // gulp.watch(sourceFolder.css + '/*.css', ['cssmin']);
});

// The default task (called when you run `gulp` from cli)
// gulp.task('default', ['watch', 'scripts', 'scss']);
gulp.task('default', ['watch', 'scripts', 'scss']);
