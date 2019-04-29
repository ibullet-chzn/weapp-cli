const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const paths = require('../../config/paths');
const writeFile = require('../utils/writeFile');
const wrap = require('../utils/wrap');

/** svg 转 base64 */
const svg = (buffer) => {
  const str = buffer
    .toString()
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\#/g, '%23') // eslint-disable-line
    .replace(/\"/g, "'"); // eslint-disable-line
  return `url("data:image/svg+xml;utf8,${str}")`;
};

/** 图片转 base64 */
const img = (buffer, ext) => `url("data:image/${ext};base64,${buffer.toString('base64')}")`;

const sassLoader = async ({ origin, dist }) => {
  const importer = (url, prev) => {
    const urlArr = url.split('');
    let newUrl = url;
    if (urlArr[0] === '@') {
      newUrl = url.replace('@', paths.src);
    } else {
      newUrl = path.resolve(path.dirname(prev), url);
    }
    return { file: newUrl };
  };
  const functions = {
    /** 图片编译为base64 */
    'url($img)': (file) => {
      const relativePath = file.getValue();
      let filePath = '';
      let str = '';
      if (relativePath.indexOf('@') === 0) {
        filePath = relativePath.replace('@', paths.src);
        const buffer = Buffer.from(fs.readFileSync(filePath));
        const ext = relativePath.split('.').pop();
        str = ext === 'svg' ? svg(buffer, ext) : img(buffer, ext);
      } else {
        str = `url("${relativePath}")`;
      }
      return sass.types.String(str);
    },
  };
  const result = await wrap(sass.render)({
    file: origin,
    outputStyle: 'expanded',
    importer,
    functions,
  });
  await writeFile(dist, result.css);
  return true;
};

module.exports = sassLoader;
