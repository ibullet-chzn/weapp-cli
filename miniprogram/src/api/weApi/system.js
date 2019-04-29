const getSystemInfo = async () => new Promise((resolve, reject) => {
  wx.getSystemInfo({
    success(res) {
      resolve(res);
    },
    fail: reject,
  });
});

// eslint-disable-next-line
export { getSystemInfo };
