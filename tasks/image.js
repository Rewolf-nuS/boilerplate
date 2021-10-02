const { src, dest } = require('gulp');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').get('Main');

const path = require('./path');

const imgTask = () => {
  return src(path.src.img)
    .pipe(changed(path.dist.img))
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
    .pipe(dest(path.dist.img))
    .pipe(browserSync.stream());
};

exports.imgTask = imgTask;
