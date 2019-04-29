/**
 * 将 Node 的回调函数转成 Promise
 * @param {function} func 要转换的函数
 * @returns {Promise}
 */
const wrap = func => (...params) => new Promise((resolve, reject) => {
  const callback = (error, ...result) => {
    if (error) {
      reject(error);
    } else {
      resolve(...result);
    }
  };
  func.apply(this, [...params, callback]);
});

module.exports = wrap;
