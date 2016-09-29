var gulp = require('gulp');
var path = require('path');
// var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var scss = require('gulp-ruby-sass');
var del = require('del');

var THEME_ASSETS_PATH = path.join(__dirname, './content/themes/test-zh/assets');
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

var logins = [
  'js/login.js'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});
var allJs = libs.concat(logins);
var _sourceFolders = 'js css scss'.split(' ');
var sourceFolder = {};

_sourceFolders.forEach(function (item) {
  sourceFolder[item] = path.join(THEME_ASSETS_PATH, item + '/');
});

var dist = {
  lib: path.join(THEME_ASSETS_PATH, '/dist/js/libs.min.js'),
  login: path.join(THEME_ASSETS_PATH, '/dist/js/login.min.js')
};
// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

// console.log(path.join(sourceFolder.scss, '/*.scss'))
// gulp.task("scss", function () {
//   scss(path.join(sourceFolder.scss, '/screen.scss'), {
//     sourcemap: true
//   })
//   .pipe(sourcemaps.write())
//   .pipe(gulp.dest(sourceFolder.css));
//   // gulp.src(
//   //     path.join(sourceFolder.scss, '/*.scss')
//   // ).pipe(scss(
//   //     {"bundleExec": true}
//   // )).pipe(gulp.dest(sourceFolder.css));
// });

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  // return gulp.src(sourceFolder.js + '/*.js')
  return gulp.src(allJs)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(THEME_ASSETS_PATH, '/dist/js')));
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
  // gulp.watch(sourceFolder.scss + '/*.scss', ['scss']);
});

// The default task (called when you run `gulp` from cli)
// gulp.task('default', ['watch', 'scripts', 'scss']);
gulp.task('default', ['watch', 'scripts']);
