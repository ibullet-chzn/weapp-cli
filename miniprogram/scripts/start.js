const fs = require('fs-extra');
const commander = require('commander');
const chokidar = require('chokidar');
const chalk = require('chalk');
const paths = require('../config/paths');
const ignore = require('../config/ignore');
const parseFile = require('./utils/parseFile');
const wrap = require('./utils/wrap');
const complier = require('./utils/complier');
const getSrcFiles = require('./utils/getSrcFiles');

const getDistArr = async () => {
  console.log('🚚 获取源文件列表...');
  const srcFiles = await getSrcFiles();
  console.log('⏳ 生成目标文件列表...');
  const result = srcFiles.map(file => parseFile(file));
  return result;
};

const watcher = chokidar.watch(`${paths.src}/**/*`, {
  ignoreInitial: true,
  ignored: ignore,
});

commander
  .action(async () => {
    console.log('🔥 清空`output`文件夹...');
    fs.emptyDirSync(paths.output);
    const distFiles = await getDistArr();
    console.log('🛠 编译源文件...');
    await Promise.all(distFiles.map(item => complier(item)));
    console.log(`😎 开始监听文件夹: ${chalk.green.bold(paths.src)}`);
    watcher.on('all', async (event, file) => {
      const filePath = process.platform === 'win32' ? file.replace(/\\/g, '/') : file;
      console.log(chalk.bgBlue.bold(event.toUpperCase()), filePath.replace(paths.src, ''));
      const result = await parseFile(filePath);
      // 删除文件
      if (event === 'unlink') {
        await wrap(fs.unlink)(result.dist);
      } else {
        await complier(result);
      }
    });
  });

commander.parse(process.argv);
