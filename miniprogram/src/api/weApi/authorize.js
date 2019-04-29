const scopeList = {
  userInfo: { apiName: ['getUserInfo'], authMsg: '需要使用你的用户信息' },
  userLocation: { apiName: ['getLocation', 'chooseLocation'], authMsg: '需要获取你的地理位置' },
  address: { apiName: ['chooseAddress'], authMsg: '需要使用你的通讯地址' },
  invoiceTitle: { apiName: ['chooseInvoiceTitle'], authMsg: '需要使用你的发票抬头' },
  invoice: { apiName: ['chooseInvoice'], authMsg: '需要获取你的发票' },
  werun: { apiName: ['getWeRunData'], authMsg: '需要获取你的微信运动数据' },
  record: { apiName: ['startRecord'], authMsg: '需要使用你的录音功能' },
  writePhotosAlbum: {
    apiName: ['saveImageToPhotosAlbum', 'saveVideoToPhotosAlbum'],
    authMsg: '需要使用你的相册',
  },
  camera: { apiName: [], authMsg: '需要使用你的相机' },
};

const getSetting = (scopeName) => {
  if (!scopeList[scopeName]) return false;
  return new Promise((resolve) => {
    wx.getSetting({
      success({ authSetting }) {
        resolve(authSetting[`scope.${scopeName}`]);
      },
    });
  });
};

/**
 * 0 -> 权限验证不通过
 * 1 -> 权限验证通过
 * 2 -> 开启小程序设置页
 */
const checkAuthor = async (scopeName, auth = false) => {
  const getSettingResult = await getSetting(scopeName);
  if (!getSettingResult) {
    if (auth && getSettingResult === false) {
      return 2;
    }
    return 0;
  }
  return 1;
};

const catchError = async ({ errMsg }, apiName, scopeName, auth = false) => {
  const checkAuthorResult = await checkAuthor(scopeName, auth);
  switch (checkAuthorResult) {
    case 0:
      return errMsg;
    case 2:
      // todo: 开启小程序设置页
      return false;
    case 1:
    default:
      return true;
  }
};

export { checkAuthor, catchError };
