const del = require('del');

const path = require('./path');

const resetFolder = (done) => {
  del.sync(['dist/**']);
  done();
};

const resetImg = (done) => {
  del.sync([path.dist.img]);
  done();
};

const resetMap = (done) => {
  del.sync(['./dist/**/*.map']);
  done();
};

exports.resetFolder = resetFolder;
exports.resetImg = resetImg;
exports.resetMap = resetMap;
