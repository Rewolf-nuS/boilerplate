module.exports = {
  src: {
    pug: ['src/pug/**/*.pug', '!' + 'src/pug/**/_*.pug'],
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/img/**'
  },
  dist: {
    pug: 'dist',
    scss: 'dist/css',
    js: 'dist/js',
    img: 'dist/img'
  }
};
