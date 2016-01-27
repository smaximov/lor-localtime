/* eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');

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

gulp.task('manifest', ['pack'], function () {
    return gulp.src(['manifest', 'build/localtime.js'])
	.pipe(concat('localtime.js'))
	.pipe(gulp.dest('.'));
});

gulp.task('default', ['manifest']);
