const path = require('path');
const fileLoader = require('../loader/file');
const sassLoader = require('../loader/sass');
const babelLoader = require('../loader/babel');

const complier = async (file) => {
  const originExtname = path.extname(file.origin);
  switch (originExtname) {
    case '.scss':
      return sassLoader(file);
    case '.js':
      if (file.origin.includes('/src/lib/polyfill.js')) {
        return fileLoader(file);
      }
      return babelLoader(file);
    case '.wxs':
      return babelLoader(file);
    default:
      return fileLoader(file);
  }
};

module.exports = complier;
