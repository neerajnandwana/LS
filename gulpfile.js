var gulp = require('gulp'),
    qunit = require('gulp-qunit'),
    coveralls = require('./index.js');

gulp.task('qunit', function() {
    return gulp.src('./test.html')
        .pipe(qunit()); 
});

gulp.task('coveralls', function() {
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['qunit']);
