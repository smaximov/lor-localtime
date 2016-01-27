/* eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var template = require('gulp-template');
var mocha = require('gulp-mocha');

var pkg = require('./package.json');

gulp.task('build', function () {
  return gulp.src(['src/**/*.js', '!src/localtime.meta.js'])
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('pack', ['build'], function () {
  var webpackConfig = {
    output: {
      filename: 'localtime.js'
    }
  };
  return gulp.src('build/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build'));
});

gulp.task('meta', function () {
  var bindings = {
    name: pkg.description,
    version: pkg.version,
    updateURL: 'https://raw.githubusercontent.com/smaximov/lor-localtime/master/localtime.meta.js',
    downloadURL: 'https://raw.githubusercontent.com/smaximov/lor-localtime/master/localtime.js'
  };
  return gulp.src('src/localtime.meta.js')
    .pipe(template(bindings))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['meta', 'pack'], function () {
  return gulp.src(['localtime.meta.js', 'build/localtime.js'])
    .pipe(concat('localtime.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('test', ['build'], function () {
  return gulp.src('test/**/test_*.js')
    .pipe(mocha())
});

gulp.task('default', ['concat']);
