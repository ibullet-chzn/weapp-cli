console.log('wea-cli');

const fs = require('fs');

const readlineSync = require('readline-sync');

const projectName = readlineSync.question('project name? ');
console.log('Hi ' + projectName + '!');

fs.mkdir(`./${projectName}`,function(err){
  if (err) {
    return console.error(err);
  }
  console.log("目录创建成功。");
  console.log("准备写入文件");
  fs.writeFile(`./${projectName}/input.txt`, '我是通 过fs.writeFile 写入文件的内容',  function(err) {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功！");
    console.log("--------我是分割线-------------")
    console.log("读取写入的数据！");
    fs.readFile(`./${projectName}/input.txt`, function (err, data) {
      if (err) {
        return console.error(err);
      }
      console.log("异步读取文件数据: " + data.toString());
    });
  });
});

