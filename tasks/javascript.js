const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').get('Main');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

const path = require('./path');

const jsTask = () => {
  return src(path.src.js, { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest(path.dist.js, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

exports.jsTask = jsTask;
