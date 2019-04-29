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
