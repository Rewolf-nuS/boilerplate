const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');

const ejs = require('gulp-ejs');
const htmlbeautify = require('gulp-html-beautify');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const gcmq = require("gulp-group-css-media-queries");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const Fiber = require('fibers');

const concat = require('gulp-concat');
const terser = require('gulp-terser');

const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const files = {
  ejsPath: ['src/ejs/**/*.ejs', '!' + 'src/ejs/**/_*.ejs'],
  scssPath: 'src/scss/**/*.scss',
  jsPath: 'src/js/**/*.js',
  imgPath: 'src/img/**',
};

const cleanFolder = (done) => {
  del.sync(['dist/**', '!' + 'dist/img/**']);

  done();
};

const cleanImg = (done) => {
  del.sync(['dist/img/**']);
  done();
};

const ejsTask = () => {
  return src(files.ejsPath)
    .pipe(plumber())
    .pipe(ejs())
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 0,
        preserve_newlines: false,
        indent_inner_html: false,
        extra_liners: [],
      })
    )
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('dist/'));
};

const scssTask = () => {
  return src(files.scssPath, { sourcemaps: true })
    .pipe(
      sass({
        fiber: Fiber,
      }).on('error', sass.logError)
    )
    .pipe(gcmq())
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }))
    .pipe(scssTaskMin());
};

const scssTaskMin = () => {
  return src(files.scssPath)
    .pipe(sass())
    .pipe(gcmq())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/css'));
};

const jsTask = () => {
  return src(files.jsPath, { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
};

const imgTask = () => {
  return src(files.imgPath)
    .pipe(changed('dist/img'))
    .pipe(
      imagemin([
        pngquant({
          quality: [0.7, 0.85],
        }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng(),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        }),
        imagemin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest('dist/img'));
};

const serve = (done) => {
  browsersync.init({
    server: {
      baseDir: './dist',
    },
    notify: false,
  });

  done();
};

const reload = (done) => {
  browsersync.reload();

  done();
};

const watchTask = (done) => {
  watch(files.ejsPath[0], series(ejsTask, reload));
  watch(files.scssPath, series(scssTask, reload));
  watch(files.jsPath, series(jsTask, reload));
  watch(files.imgPath, series(imgTask, reload));

  done();
};

exports.default = series(serve, watchTask);

exports.build = series(parallel(ejsTask, scssTask, jsTask));
exports.buildall = series(cleanFolder, parallel(ejsTask, scssTask, jsTask), imgTask);
exports.buildimg = series(imgTask);

exports.resetimg = series(cleanImg);
