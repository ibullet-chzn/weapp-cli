import { catchError } from './authorize';

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

// eslint-disable-next-line
export { getLocation };
