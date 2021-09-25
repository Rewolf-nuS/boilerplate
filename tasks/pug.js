const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const htmlbeautify = require('gulp-html-beautify');
const browserSync = require('browser-sync').get('Main');

const path = require('./path');

const pugTask = () => {
  return src(path.src.pug)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(
      pug({
        pretty: true,
        basedir: './src/pug'
      })
    )
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 0,
        preserve_newlines: false,
        indent_inner_html: true,
        extra_liners: []
      })
    )
    .pipe(dest(path.dist.pug))
    .pipe(browserSync.stream());
};

exports.pugTask = pugTask;
