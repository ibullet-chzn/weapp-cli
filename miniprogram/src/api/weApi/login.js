const weLogin = (options) => {
  console.log(options);
  return new Promise((resolve) => {
    // wx.request({
    //   url: '',
    //   success(data) {
    //     resolve(data)
    //   },
    //   fail(error) {
    //     reject(error)
    //   }
    // })
    resolve('123');
  });
};

export default weLogin;
