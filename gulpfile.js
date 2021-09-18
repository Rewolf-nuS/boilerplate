const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');

const { pugTask } = require('./tasks/pug.js');
const { scssTask, scssMinify } = require('./tasks/scss.js');
const { jsTask } = require('./tasks/javascript.js');
const { imgTask, cleanImg } = require('./tasks/image.js');

const path = require('./tasks/path.js')

const copyFile = () => {
  return src(['src/*.*']).pipe(dest('dist/'));
};

const cleanFolder = (done) => {
  del.sync(['dist/**']);
  done();
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
  watch(path.src.pug[0], series(pugTask, reload));
  watch(path.src.scss, series(scssTask, reload));
  watch(path.src.js, series(jsTask, reload));
  watch(path.src.img, series(imgTask, reload));

  done();
};

exports.default = series(parallel(copyFile, pugTask, scssTask, jsTask), serve, watchTask);
exports.watch = watchTask;
exports.build = series(cleanFolder, parallel(copyFile, pugTask, scssMinify, jsTask, imgTask));
exports.buildimg = imgTask;
exports.reset = cleanFolder;
exports.resetImg = cleanImg;