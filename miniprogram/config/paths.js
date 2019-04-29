const fs = require('fs');
const path = require('path');

const rootDirectory = fs.realpathSync(process.cwd());

// const resolveApp = relativePath => path.resolve(rootDirectory, relativePath);

const resolveApp = (relativePath) => {
  let absolutePath = path.resolve(rootDirectory, relativePath);
  if (process.platform === 'win32') {
    absolutePath = absolutePath.replace(/\\/g, '/');
  }
  return absolutePath;
};

module.exports = {
  root: resolveApp('.'),
  config: resolveApp('./config'),
  build: resolveApp('./build'),
  src: resolveApp('./src'),
  output: resolveApp('./output'),
};
