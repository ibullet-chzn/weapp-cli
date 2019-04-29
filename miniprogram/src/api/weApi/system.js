// 兼容 async await 写法
// eslint-disable-next-line
const regeneratorRuntime = require('../../lib/babel-runtime/regenerator/index');

const getSystemInfo = async () => new Promise((resolve, reject) => {
  wx.getSystemInfo({
    success(res) {
      resolve(res);
    },
    fail: reject,
  });
});

export { getSystemInfo };
