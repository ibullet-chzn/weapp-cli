import { Provider } from './lib/wechat-weapp-redux.min';
import store from './store/index';

// 每次发版需要更新版本号
const VERSION = '1.0.0';

// 引入 错误监控 SDK 文件
const Monitor = require('./lib/monitor.wxa.js');
// 生成 Monitor 实例
const monitor = new Monitor({
  appid: 'wxc4104b171e3d1376',
  platform: '3e3d5400-4087-11e9-8ee3-47214d861733',
});

// Request 拦截器
const RequestInterceptor = (response, options) => {
  // 过滤掉"阿拉丁"埋点接口的报错信息
  if (options.url.indexOf('https://log.aldwx.com/d.html') !== -1) {
    return true;
  }
  // 接口错误
  if (response.statusCode < 200 || response.statusCode >= 300) {
    return false;
  }
  return true;
};

// 初始化
monitor.init(RequestInterceptor);

App(
  Provider(store)({
    onLaunch() {

    },
    onShow() {

    },
    onError(error) {
      console.error(`error ---> ${error}`);
      // 上报错误监控平台
      monitor.onError(error);
    },
  }),
);
