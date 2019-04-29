const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const wrap = require('./wrap');

/**
 * 向硬盘写入文件
 * @param {string} filename 文件名
 * @param {string|Buffer} data 文件数据
 */
const writeFile = async (filename, data) => {
  await wrap(mkdirp)(path.dirname(filename));
  await wrap(fs.writeFile)(filename, data);
  return true;
};

module.exports = writeFile;
