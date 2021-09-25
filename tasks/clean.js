const del = require('del');

const path = require('./path');

const cleanFolder = (done) => {
  del.sync(['dist/**']);
  done();
};

const cleanImg = (done) => {
  del.sync([path.dist.img]);
  done();
};

const cleanMap = (done) => {
  del.sync(['./dist/**/*.map']);
  done();
};

exports.cleanFolder = cleanFolder;
exports.cleanImg = cleanImg;
exports.cleanMap = cleanMap;
