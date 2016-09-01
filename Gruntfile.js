// var mozjpeg = require('imagemin-mozjpeg');
var path = require('path');
var THEME_ASSETS_PATH = path.join(__dirname, './content/themes/test-zh/assets');
var libs = ['js/jquery/jquery-1.11.3.min.js', 'js/jquery/jquery.cookie.js', 'js/tipped.js', 'js/application.js'].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});
var logins = ['js/loginDialog.js', 'js/login.js'].map(function (item) {
  return path.join(THEME_ASSETS_PATH, item);
});
console.log(libs);
console.log(logins);
module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      "my_target": {
        "files": {
          './dist/js/lib.min.js': libs,
          './dist/js/login.min.js': logins
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
          cwd: path.join(THEME_ASSETS_PATH, '/scss/'),
          src: ['*.scss'],
          dest: '../dist/css/',
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
          cwd: path.join(THEME_ASSETS_PATH, '/css/'),
          src: ['*.css'],
          dest: '../dist/css'
        }]
      },
      target: {
        files: {
          './dist/css/public.min.css': ['css/tipped.css', 'css/public.css', 'css/loginDialog.css'],
          './dist/css/<%= pkg.file %>.css': ['css/<%= pkg.file %>.css']
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
        files: ['css/*.css'],
        options: {
          livereload:true,
          debounceDelay: 500
        },
        tasks: ['compress']
      },
      js: {
        files: ['js/*.js'],
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
  // grunt.loadNpmTasks('grunt-contrib-htmlmin');
  // 默认任务
  grunt.registerTask('build', ['uglify', 'cssmin', 'imagemin']);
  grunt.registerTask('compress', ['uglify', 'cssmin']);
  // grunt.registerTask('compress', ['uglify', 'cssmin', 'imagemin']);
  // grunt.registerTask('watch', ['watch']); // 这里不能重新注册任务， 不然的话就不能监视了→＿←
  // grunt.event.on('watch', function (a, b) {
  //   console.log(a, b);
  // });
};
