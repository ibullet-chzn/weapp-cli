const fs = require('fs-extra');
const wrap = require('../utils/wrap');

/**
 * 复制文件
 * @param {Object} file `parseFile`返回的内容
 */
const fileLoader = async ({ origin, dist }) => {
  await wrap(fs.copy)(origin, dist);
  return true;
};

module.exports = fileLoader;
