const path = require('path');
const paths = require('../../config/paths');
const exts = require('../../config/ext');

const parseFile = (file) => {
  const extname = path.extname(file);
  let dist = file.replace(paths.src, paths.output);
  if (exts.wx[extname]) {
    dist = dist.replace(extname, exts.wx[extname]);
  }
  return { origin: file, dist };
};

module.exports = parseFile;
