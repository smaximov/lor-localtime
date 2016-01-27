/* eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');

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
	.pipe(gulp.dest('.'));
});

gulp.task('default', ['pack']);
