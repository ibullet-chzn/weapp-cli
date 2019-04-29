function isEmpty(obj) {
  return !(obj !== null && obj !== undefined && obj !== '');
}

const isHttpSuccess = status => (status >= 200 && status < 300) || status === 304;

const weRequest = ({
  url = '', data = {}, method = 'GET', header = null,
}) => {
  const options = { url, data, method };
  if (header) {
    options.header = header;
  }
  // 去除为空参数
  Object.keys(data).map((index) => {
    if (isEmpty(data[index])) {
      delete data[index];
    }
    return data[index];
  });
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success(res) {
        const isSuccess = isHttpSuccess(res.statusCode);
        if (isSuccess) {
          // 成功的请求状态
          resolve(res.data);
        } else {
          reject();
        }
      },
      fail: reject,
    });
  });
};

export default weRequest;
