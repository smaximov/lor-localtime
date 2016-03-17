/* eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var template = require('gulp-template');
var mocha = require('gulp-mocha');
var newer = require('gulp-newer');

var pkg = require('./package.json');

gulp.task('build', () => {
  const dest = 'build';
  return gulp.src(['src/**/*.js', '!src/localtime.meta.js'])
    .pipe(newer(dest))
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task('pack', ['build'], () => {
  const dest = 'build';
  const webpackConfig = {
    output: {
      filename: 'localtime.user.js'
    }
  };
  return gulp.src('build/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(dest));
});

gulp.task('meta', () => {
  const bindings = {
    name: pkg.description,
    version: pkg.version,
    updateURL: 'https://raw.githubusercontent.com/smaximov/lor-localtime/master/localtime.meta.js',
    downloadURL: 'https://raw.githubusercontent.com/smaximov/lor-localtime/master/localtime.user.js'
  };
  return gulp.src('src/localtime.meta.js')
    .pipe(template(bindings))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['meta', 'pack'], () => {
  return gulp.src(['localtime.meta.js', 'build/localtime.user.js'])
    .pipe(concat('localtime.user.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('test', ['build'], () => {
  const mochaConfig = {
    require: ['./test/helper']
  };
  return gulp.src('test/**/test_*.js')
    .pipe(mocha(mochaConfig))
});

gulp.task('default', ['concat']);
