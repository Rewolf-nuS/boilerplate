const { src, dest } = require('gulp');

const copyFile = () => {
  return src(['src/*.*']).pipe(dest('dist/'));
};

exports.copyFile = copyFile;
