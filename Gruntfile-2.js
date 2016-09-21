// var mozjpeg = require('imagemin-mozjpeg');
var path = require('path');
var THEME_ASSETS_PATH = path.join(__dirname, './content/themes/test-zh/assets');
var libs = [
  'js/jquery/jquery-1.11.3.min.js',
  'js/jquery/jquery.cookie.js',
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
  'js/loginDialog.js',
  'js/login.js'
].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});

var sourceFolder = {
  js: path.join(THEME_ASSETS_PATH, './js/'),
  css: path.join(THEME_ASSETS_PATH, './css/'),
  scss: path.join(THEME_ASSETS_PATH, './scss/')
};

console.log(libs);
console.log(logins);
console.log(sourceFolder);
console.log(css);
var dist = {
  lib: path.join(THEME_ASSETS_PATH, '/dist/js/libs.min.js'),
  login: path.join(THEME_ASSETS_PATH, '/dist/js/login.min.js')
};
console.log(dist);
module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    // pkg: grunt.file.readJSON('package.json'),
    uglify: {
      "my_target": {
        "files": {
          './content/themes/test-zh/assets/dist/js/libs.min.js': libs,
          './content/themes/test-zh/assets/dist/js/login.min.js': logins
        },
        options: {
          sourceMap: true
        }
      }
    },
    scss: {
      dist: {
        files: [{
          expand: true,
          cwd: sourceFolder.scss,
          src: ['*.scss'],
          dest: sourceFolder.css,
          ext: '.css'
        }]
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: sourceFolder.css,
          src: ['*.css'],
          dest: path.join(THEME_ASSETS_PATH, '/dist/blog.css')
        }]
      },
      target: {
        files: {
          './content/themes/test-zh/assets/dist/css/public.min.css': css/*,
          './dist/css/<%= pkg.file %>.css': ['css/<%= pkg.file %>.css']*/
        }
      }
    },
    imagemin: {                          // Task
      dynamic: {
        options: {                       // Target options
          optimizationLevel: 7,
          use: [jpegOptim({max:80})],
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'images',
          src: ['*.{png,jpg,gif,jpeg}', '**/*.{png,jpg,gif,jpeg}'],
          dest: './dist/images'
        }]
      }
    },
    watch: {
      css: {
        files: css,
        options: {
          livereload:true,
          debounceDelay: 500
        },
        tasks: ['compress']
      },
      js: {
        files: [],
        options: {
          livereload:true,
          debounceDelay: 500
        },
        tasks: ['compress']
      }
    }
  });
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('build', ['uglify', 'cssmin', 'imagemin']);
  grunt.registerTask('compress', ['uglify', 'cssmin']);
};
