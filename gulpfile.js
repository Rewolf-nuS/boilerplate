const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const notify = require('gulp-notify');

const pug = require('gulp-pug');
const htmlbeautify = require('gulp-html-beautify');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const mq = require('postcss-sort-media-queries');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const Fiber = require('fibers');

const concat = require('gulp-concat');
const terser = require('gulp-terser');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const path = {
  pugSrc: ['src/pug/**/*.pug', '!' + 'src/pug/**/_*.pug'],
  pugDist: ['dist'],
  scssSrc: 'src/scss/**/*.scss',
  scssDist: 'dist/css',
  jsSrc: 'src/js/**/*.js',
  jsDist: 'dist/js',
  imgSrc: 'src/img/**',
  imgDist: 'dist/img',
};

const copyFile = () => {
  return src(['src/*.*'])
    .pipe(dest('dist/'))
}

const cleanFolder = (done) => {
  del.sync(['dist/**']);
  done();
};

const cleanImg = (done) => {
  del.sync([path.imgSrc]);
  done();
};

const pugTask = () => {
  return src(path.pugSrc)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
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
        indent_inner_html: false,
        extra_liners: []
      })
    )
    .pipe(dest(path.pugDist))
};

const scssTask = () => {
  return src(path.scssSrc, { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(
      sass({
        fiber: Fiber
      })
    )
    .pipe(postcss([mq(), autoprefixer()]))
    .pipe(dest(path.scssDist, { sourcemaps: '.' }))
    .pipe(scssTaskMin())
};

const scssTaskMin = () => {
  return src(path.scssSrc)
    .pipe(plumber())
    .pipe(
      sass({
        fiber: Fiber
      })
    )
    .pipe(postcss([mq(), autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(path.scssDist))
};

const jsTask = () => {
  return src(path.jsSrc, { sourcemaps: true })
    .pipe(changed('dist/js'))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest(path.jsDist, { sourcemaps: '.' }))
};

const imgTask = () => {
  return src(path.imgSrc)
    .pipe(changed(path.imgSrc))
    .pipe(
      imagemin([
        pngquant({
          quality: [0.7, 0.85]
        }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng(),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        }),
        imagemin.gifsicle({ optimizationLevel: 3 })
      ])
    )
    .pipe(dest(path.imgDist));
};

const serve = (done) => {
  browsersync.init({
    server: {
      baseDir: './dist'
    },
    open: false,
    notify: false
  });
  done();
};

const reload = (done) => {
  browsersync.reload();
  done();
};

const watchTask = (done) => {
  watch(path.pugSrc[0], series(pugTask, reload));
  watch(path.scssSrc, series(scssTask, reload));
  watch(path.jsSrc, series(jsTask, reload));
  watch(path.imgSrc, series(imgTask, reload));

  done();
};

exports.default = series(parallel(copyFile, pugTask, scssTask, jsTask), serve, watchTask);

exports.watch = watchTask;

exports.build = series(cleanFolder, parallel(copyFile, pugTask, scssTask, jsTask), imgTask);

exports.buildimg = imgTask;
exports.resetimg = cleanImg;