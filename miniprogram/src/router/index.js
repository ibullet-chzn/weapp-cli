// saas://mini/orderDetail?order_id=123456

import * as storage from '../lib/storage';
import isVoidObject from '../utils/isVoidObject';

/**
 * 使用方法：
 *  const orderId = 123456
 Router.navigate(`clite://mini/orderDetail?order_id=${orderId}`);
 备注：!!!路由不能在页面未注册时使用 - 由于微信未提供页面注册相关api so 人为控制!!!
 */

function joinParameters(params = {}) {
  const paramList = [];
  Object.keys(params).forEach((key) => {
    paramList.push(`${key}=${JSON.stringify(params[key])}`);
  });
  return paramList.length > 0 ? `?${paramList.join('&')}` : '';
}

function ParseURL(url) {
  let protocol;
  let host;
  let pathname;
  let urlStr = url;
  if (urlStr) {
    protocol = urlStr.substr(0, urlStr.indexOf(':'));
    host = urlStr.substr(urlStr.indexOf('//') + 2);
    const index = host.indexOf('?');
    if (index === -1) {
      pathname = host.substring(host.indexOf('/') + 1);
    } else {
      pathname = host.substring(host.indexOf('/') + 1, index);
    }

    host = host.substr(0, host.indexOf('/'));

    urlStr = urlStr.indexOf('?') >= 0 ? urlStr.substr(urlStr.indexOf('?') + 1) : '';
  }
  const result = {};
  const items = urlStr ? urlStr.split('&') : [];
  items.forEach((item) => {
    const arr = item.split('=');
    const name = arr[0];
    const value = arr[1];
    result[name] = value;
  });

  return {
    protocol,
    host,
    pathname,
    params: result,
  };
}

class Router {
  static navigate(url = '', options, routerType) {
    const obj = new ParseURL(url);
    if (obj.protocol !== 'clite') {
      return;
    }
    Router.routerMap[obj.host](obj, options, routerType);
  }

  static navigateBack(delta = 1) {
    wx.navigateBack({ delta });
  }

  static mini(obj = {}, options = null, routerType) {
    const { path, config } = Router.miniRouterMap[obj.pathname]();
    const { params } = obj;
    Router.open(path, params, routerType, { ...config, ...options });
  }

  static keepLogin(bool = false) {
    if (bool) {
      const token = storage.get('WX_STORAGE_STOKENUSS');
      if (token) {
        return true;
      }
      Router.navigate('clite://mini/login');
      return false;
    }
    return true;
  }

  static beforeRouter(options, next) {
    const loginResult = this.keepLogin(options.keepLogin);
    if (!loginResult) return false;
    if (options.custom) {
      options.custom(next);
      return;
    }
    next();
  }

  static open(path, params, type = 'navigateTo', options) {
    const next = (redirect) => {
      // 如果重定向
      if (redirect) {
        Router.navigate(redirect);
        return;
      }
      // 防止路由循环
      // todo:前置条件 不能带参数
      if (type === 'navigateTo' && isVoidObject(params)) {
        const pages = getCurrentPages();
        const last = pages.length >= 2 ? pages[pages.length - 2] : '';
        if (`/${last.route}` === path) {
          wx.navigateBack();
          return;
        }
      }
      wx[type]({ url: `${path}${joinParameters({ ...params })}` });
    };
    // 钩子函数
    const optionsType = Object.prototype.toString.call(options);
    if (optionsType === '[object Object]') {
      this.beforeRouter(options, next);
      return;
    }
    next();
  }
}

Router.routerMap = {
  mini: Router.mini,
};

Router.miniRouterMap = {
  home: () => ({ path: '/pages/home/index' }),
  login: () => ({ path: '/pages/login/index' }),
  my: () => ({ path: '/pages/my/index', config: { keepLogin: true } }),
};

export default Router;
