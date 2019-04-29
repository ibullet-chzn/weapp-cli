const fs = require('fs-extra');
const commander = require('commander');
const paths = require('../config/paths');
const getSrcFiles = require('./utils/getSrcFiles');
const parseFile = require('./utils/parseFile');
const complier = require('./utils/complier');

/**
 * 获取要生成的文件列表
 */
const getDistArr = async () => {
  console.log('🚚 获取源文件列表...');
  const srcFiles = await getSrcFiles();
  console.log('⏳ 生成目标文件列表...');
  const result = srcFiles.map(file => parseFile(file));
  return result;
};

commander
  .action(async () => {
    const start = new Date();
    /** 清空 output 文件夹 */
    console.log('🔥 清空`output`文件夹...');
    fs.emptyDirSync(paths.output);
    console.log('😃 开始编译...');
    const distFiles = await getDistArr();
    console.log('🛠 编译源文件...');
    await Promise.all(distFiles.map(item => complier(item)));
    console.log(`🤗 完成咯，共耗时${new Date() - start}ms`);
  });

commander.parse(process.argv);
