const { src, dest } = require('gulp');
const changed = require('gulp-changed');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const path = require('./path');

const imgTask = () => {
  return src(path.src.img)
    .pipe(changed(path.src.img))
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
    .pipe(dest(path.dist.img));
};

const cleanImg = (done) => {
  del.sync([path.imgSrc]);
  done();
};

exports.imgTask = imgTask;
exports.cleanImg = cleanImg;
