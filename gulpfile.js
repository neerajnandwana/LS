var gulp = require('gulp'),
    qunit = require('gulp-qunit');

gulp.task('qunit', function() {
    return gulp.src('./test.html')
        .pipe(qunit()); 
});

gulp.task('default', ['qunit']);
