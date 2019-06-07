"use strict";

const gulp = require('gulp'),
      sass =  require('gulp-sass'),
      browserSync =  require('browser-sync').create(),
      autoPreFixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      concat = require('gulp-concat'),
      imagemin = require('gulp-imagemin'),
      minify = require('gulp-babel-minify'),
      uglify = require('gulp-uglify'),
      terser = require('gulp-terser');



const SOURCE = './src/';
const DESTINATION = 'dist/';


let buildScript = function(){
    return gulp.src([SOURCE + 'js/data.js',SOURCE + 'js/cv.js'])
        .pipe(concat('main.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest(DESTINATION + 'js'))

};

//compile scss into css
let buildStyle = function(){
    // 1. where is scss file
    return gulp.src(SOURCE + '/scss/layout.scss')
        //2. pass that scss file through sass compiler
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(DESTINATION + 'css'))
        .pipe(browserSync.stream());
};

let buildImages = function(){

    return gulp.src( [ SOURCE + 'img/**/*', SOURCE + 'img/'])
        .pipe(imagemin())
        .pipe(gulp.dest(DESTINATION + 'img'))
};

let buildHtml = function(){
    return gulp.src(SOURCE + '/*.html')
        .pipe(gulp.dest(DESTINATION))
};



// Watch for changes to the src directory
let startServer =function(done){

    // Initialize BrowserSync
    browserSync.init({
        server: {
            baseDir: DESTINATION
        }
    });
    done();

};

// Reload the browser when files change
let reloadBrowser = function (done) {
	browserSync.reload();
	done();
};


// Default task
// gulp
exports.default = gulp.series(
    gulp.parallel(
        buildScript,
        buildStyle,
        buildImages,
        buildHtml
    )
);

// Watch for changes
let watchSource = function (done) {
	gulp.watch( SOURCE, gulp.series(exports.default, reloadBrowser));
	done();
};


exports.watch = gulp.series(
    exports.default,
    startServer,
    watchSource

);

