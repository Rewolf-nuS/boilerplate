const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const mq = require('postcss-sort-media-queries');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const Fiber = require('fibers');

const path = require('./path');

const scssTask = () => {
  return src(path.src.scss, { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(
      sass({
        fiber: Fiber
      })
    )
    .pipe(postcss([mq(), autoprefixer()]))
    .pipe(dest(path.dist.scss, { sourcemaps: '.' }))
    .pipe(scssMinify());
};

const scssMinify = () => {
  return src(path.src.scss)
    .pipe(plumber())
    .pipe(
      sass({
        fiber: Fiber
      })
    )
    .pipe(postcss([mq(), autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(path.dist.scss));
};

exports.scssTask = scssTask;
exports.scssMinify = scssMinify;
