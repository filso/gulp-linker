/*
 * gulp-linker
 * https://github.com/filipsobczak/gulp-linker
 */

'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  nodeunit = require('gulp-nodeunit'),
  concat = require('gulp-concat'),
  linker = require('./'),
  clean = require('gulp-clean');



var paths = {
  scripts: ['*.js', 'test/*.js'],
  tests: 'test/*_test.js',
  linkedFile: 'test/fixtures/file.html',
  linkedJS: 'test/fixtures/*.js'
};


gulp.task('jshint', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(jshint());
});

gulp.task('linker', function() {
	gulp.src(paths.linkedFile)
	  .pipe(linker({
			scripts: paths.linkedJS,
      startTag: '<!--SCRIPTS-->',
      endTag: '<!--SCRIPTS END-->',
      fileTmpl: '\n<script src="%s"></script>',
      appRoot: 'test/'
    }))
	  .pipe(gulp.dest('tmp'));
});

gulp.task('clean', function() {
  gulp.src([ 'tmp', paths.testResults ], {read: false })
    .pipe(clean());
});

gulp.task('nodeunit', [ 'linker' ], function() {
  gulp.src(paths.tests)
    .pipe(nodeunit());
});

gulp.task('test', ['clean', 'nodeunit']);

gulp.task('default', ['jshint', 'test']);
