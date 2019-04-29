const remove = key => {
  wx.removeStorageSync(key);
  wx.removeStorageSync(`${key}__expires__`);
  return undefined;
};

const get = key => {
  const currentTime = Date.now();
  const timeout = wx.getStorageSync(`${key}__expires__`) || currentTime + 1;
  // 过期失效
  if (currentTime >= timeout) {
    remove(key);
    return;
  }
  return wx.getStorageSync(key);
};

/**
 * 设置缓存 expired：过期时间（分钟）
 * 存储的值仅限 String/Object/Array
 * @param key
 * @param value
 * @param expired
 * @return {*}
 */
const set = (key, value, expired) => {
  wx.setStorageSync(key, value);
  if (expired) {
    wx.setStorageSync(`${key}__expires__`, Date.now() + 1000 * 60 * expired);
  }

  return value;
};

export { get, set, remove };
