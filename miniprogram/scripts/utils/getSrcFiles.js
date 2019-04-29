const glob = require('glob');
const paths = require('../../config/paths');
const ignore = require('../../config/ignore');
const wrap = require('./wrap');

/** 获取源文件列表 */
const getSrcFiles = async () => {
  const pattern = `${paths.src}/**/*`;
  const files = await wrap(glob)(pattern, { ignore, nodir: true });
  return files;
};

module.exports = getSrcFiles;
