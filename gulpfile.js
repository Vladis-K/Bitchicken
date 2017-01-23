var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var wiredep = require('wiredep').stream;
//babel
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');


//server
gulp.task('server', function() {
    gulp.src('app')
        .pipe(server({
            livereload: true,
            defaultFile: 'index.html',
            //fallback: 'index.html',
            open: true
        }));
});

//bower
gulp.task('bower', function () {
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory:'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

//styles
gulp.task('styles', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'));
});

//Images
gulp.task('images', function(){
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('build/img'));
});

//Finish Build
// gulp.task('build', ['images'], function () {
//     return gulp.src('app/*.html')
//         .pipe(useref())
//         .pipe(gulpif('*.js', uglify()))
//         .pipe(gulpif('*.css', minifyCss()))
//         .pipe(gulp.dest('build'));
// });


//React-babel Build
gulp.task('build', function () {
    return browserify({entries: 'app/js/main.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/js/dist'));
});


gulp.task('watch', function () {
    gulp.watch('app/js/**/*.jsx', ['build'] );
    gulp.watch('app/sass/**/*.sass', ['styles']);
    gulp.watch('bower.json', ['bower']);
});

//default
gulp.task('default', ['server','watch']);
