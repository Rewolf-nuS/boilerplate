const { watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create('Main');
const { pugTask } = require('./tasks/pug');
const { scssTask } = require('./tasks/scss');
const { jsTask } = require('./tasks/javascript');
const { imgTask } = require('./tasks/image');
const { copyFile } = require('./tasks/copyFile');
const { resetImg, resetFolder, resetMap } = require('./tasks/reset');

const path = require('./tasks/path.js');

const serveTask = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    open: false,
    notify: false
  });
  done();
};

const watchTask = (done) => {
  watch(path.src.pug[0], pugTask);
  watch(path.src.scss, scssTask);
  watch(path.src.js, jsTask);
  watch(['src/*.*'], copyFile);

  done();
};

exports.default = series(parallel(copyFile, pugTask, jsTask, scssTask), serveTask, watchTask);
exports.watch = series(serveTask, watchTask);
exports.build = series(resetFolder, parallel(copyFile, pugTask, scssTask, jsTask, imgTask), resetMap);
exports.buildimg = imgTask;
exports.reset = resetFolder;
exports.resetImg = resetImg;
