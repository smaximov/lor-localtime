/* eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var template = require('gulp-template');

var pkg = require('./package.json');

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
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

gulp.task('manifest', function () {
    var bindings = {
	name: pkg.description,
	version: pkg.version
    };
    return gulp.src('src/manifest')
	.pipe(template(bindings))
	.pipe(gulp.dest('build'));
});

gulp.task('concat', ['manifest', 'pack'], function () {
    return gulp.src(['build/manifest', 'build/localtime.js'])
	.pipe(concat('localtime.js'))
	.pipe(gulp.dest('.'));
});

gulp.task('default', ['concat']);
