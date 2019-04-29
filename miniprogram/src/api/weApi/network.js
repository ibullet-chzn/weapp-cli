// 兼容 async await 写法
// eslint-disable-next-line
const regeneratorRuntime = require('../../lib/babel-runtime/regenerator/index');

const getNetworkType = async () => new Promise((resolve, reject) => {
  wx.getNetworkType({
    success(res) {
      resolve(res.networkType);
    },
    fail: reject,
  });
});

const onNetworkStatusChange = (callback) => {
  wx.onNetworkStatusChange(callback);
};

export { getNetworkType, onNetworkStatusChange };
