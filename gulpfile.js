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
gulp.task('js', function() {
    gulp.src(['./src/js/*.js', './routes/*.js'])
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

//SASS
gulp.task('scss', function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

//CSS minify
gulp.task('css', function () {
    gulp.run('scss');
    gulp.src('./src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'));
});

//Minify new images
gulp.task('imagemin', function() {
    var imgSrc = './src/img/**/*',
        imgDst = './build/img';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

//Minify new or changed HTML pages
gulp.task('htmlpage', function() {
    var htmlSrc = './src/templates/*.html',
        htmlDst = './build/templates';
    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst));
});

gulp.task('default', ['htmlpage', 'js', 'scss', 'csslint', 'imagemin'], function () {
    console.log('Build Done.');
});