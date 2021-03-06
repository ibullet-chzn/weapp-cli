const getClipboardData = async () => new Promise((resolve, reject) => {
  wx.getClipboardData({
    success(res) {
      resolve(res.data);
    },
    fail: reject,
  });
});

const setClipboardData = async data => new Promise((resolve, reject) => {
  wx.setClipboardData({
    data,
    success: resolve,
    fail: reject,
  });
});

export { getClipboardData, setClipboardData };
