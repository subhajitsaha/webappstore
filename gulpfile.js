var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    uglify  = require('gulp-uglify'),
    csslint = require('gulp-csslint'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html');
    
//JS task
gulp.task('build-js', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

//CSSlint task
gulp.task('csslint', function() {
    gulp.src('./build/css/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});

//SCSS to CSS and minify
gulp.task('build-css', function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css'));
});

//Minify new images
gulp.task('build-image', function() {
    var imgSrc = './src/img/**/*',
        imgDst = './build/img';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

//Minify new or changed HTML pages
gulp.task('build-html', function() {
    var htmlSrc = './src/templates/*.html',
        htmlDst = './build/templates';
    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('./src/scss/*.scss', ['build-css']);
    gulp.watch('./src/js/*.js', ['build-js']);
    gulp.watch('./src/img/**/*', ['build-image']);
    gulp.watch('./src/templates/*.html', ['build-html']);
});

//Build task
gulp.task('build', ['build-js', 'build-css', 'build-image', 'build-html']);