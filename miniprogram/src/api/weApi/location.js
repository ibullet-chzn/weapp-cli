// 兼容 async await 写法
// eslint-disable-next-line
import { catchError } from './authorize';

const regeneratorRuntime = require('../../lib/babel-runtime/regenerator/index');

const getLocation = async (type = 'gcj02') => new Promise((resolve, reject) => {
  wx.getLocation({
    type,
    success(res) {
      resolve(res);
    },
    async fail(error) {
      reject(await catchError(error, 'getLocation', 'userLocation'));
    },
  });
});

export { getLocation };
