// 兼容 async await 写法
// eslint-disable-next-line
const regeneratorRuntime = require('../lib/babel-runtime/regenerator/index');

/* 业务级 request 封装
 * 依赖 storage
 *
 * 部分接口需要保持登录状态(登录状态需要对外暴露-PS:部分路由也需要保持登录状态)
 * -登录态-
 * 1 静默登录(暂无): wx.login() 用户无感知
 * 2 手机号+验证码登录: 需跳转相应登录页完成登录
 * -错误收敛-
 * 1 已知错误码->直接收敛处理
 * 2 未知错误码->对外暴露,可被调用方捕获单独处理
 * PS：提供统一错误处理方式,默认自动处理,指定后接口单独处理
 * -通用参数-
 * 1 登录信息 如果有就带着
 * 2 设备指纹 指定接口需要
 * -使用方式 method方式 api方式-
 * */

import * as api from '../api/index';
import * as storage from './storage';
import Router from '../router/index';
import store from '../store/store';

let globalData = {
  host: '',
  ready: false,
  keepLogin: false,
  // todo:暂不需要session
  sessionUrl: '',
  sessionData: 'session_id',
  sessionHeaderKey: 'SESSION-ID',
};

const defaultHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
};

const _warnIgnore = message => {
  console.warn(`不合法参数丢弃:${message}`);
};

const _autoError = (reject, autoError, err) => {
  const errMsg = typeof err === 'string' ? err : err.errMsg || '系统错误';
  if (autoError) {
    wx.showToast({
      title: errMsg,
      icon: 'none',
      mask: true,
    });
  }
  reject(errMsg);
};

// 登录队列
const loginQueue = [];
let isLogin = false;

/**
 * 获取登录的token 如果没有,就跳转登录页
 * @return {Promise<any>}
 */
const getToken = () => {
  return new Promise((resolve, reject) => {
    // todo:目前单登录
    const token = storage.get('WX_STORAGE_STOKENUSS');
    if (token) {
      resolve(token);
    } else {
      // todo:兼容原有登录逻辑 登录后暴力返回首页 (暂不使用登录队列)
      // loginQueue.push({ resolve, reject });
      reject('用户未登录');
      if (!isLogin) {
        isLogin = true;
        Router.navigate('clite://mini/login');
      }
    }
  });
};

/**
 * 登录成功后 消费队列里所有请求
 * @param token
 */
const consume = token => {
  isLogin = false;
  while (loginQueue.length) {
    loginQueue.shift().resolve(token);
  }
};

/**
 * 核心的请求函数
 * @param config
 */
const request = config => {
  if (globalData.ready) {
    const { keepLogin = false, fingerprint = false, autoError = true, ...options } = config;
    return new Promise(async (resolve, reject) => {
      const post = async () => {
        // 如果需要指纹 -> 获取指纹信息
        if (fingerprint) {
          const fingerprintInfo = await store.$R_getFingerprint();
          options.params = { ...options.params, ...fingerprintInfo };
        }
        api
          .request({
            ...options,
            url:
              options.url.substr(0, 7).toLowerCase() === 'http://'
                ? options.url
                : `${globalData.host}${options.url}`,
            header: {
              ...defaultHeader,
              [globalData.sessionHeaderKey]: '',
            },
          })
          .then(res => {
            const { errno, result, errmsg } = res;
            if (errno === -1) {
              // 异常-未登录
              getToken()
                .then(async token => {
                  const { STOKEN, USS, UID, SFEXPRESS_OAUTH_INFO } = token;
                  options.params = {
                    ...options.params,
                    ...{ STOKEN, USS, UID, SFEXPRESS_OAUTH_INFO },
                  };
                  await post();
                })
                .catch(err => {
                  console.warn(err);
                });
            } else if (errno !== 0) {
              // 其余异常直接抛出
              _autoError(reject, autoError, errmsg);
            } else {
              // 正确返回结果
              resolve(result);
            }
          })
          .catch(err => {
            _autoError(reject, autoError, err);
          });
      };
      // 如果需要登录 -> 获取登录信息
      if (globalData.keepLogin || keepLogin) {
        getToken()
          .then(async token => {
            const { STOKEN, USS, UID, SFEXPRESS_OAUTH_INFO } = token;
            options.params = { ...options.params, ...{ STOKEN, USS, UID, SFEXPRESS_OAUTH_INFO } };
            await post();
          })
          .catch(err => {
            console.warn(err);
          });
        return;
      }
      await post();
    });
  } else {
    console.warn('request尚未准备好,请检查init函数是否正确执行');
  }
};
request.requestApi = {};

/**
 * 初始化函数
 * 仅接受一次初始化 处理默认值/报错
 * @param config
 */
const init = config => {
  if (!config.host) {
    console.warn('host不能为空');
    return;
  }
  if (config.keepLogin) {
    // todo:目前单登录 不强制校验sessionUrl
    if (!config.sessionUrl) {
      console.warn('sessionUrl为空');
    }
  }
  globalData = {
    ...globalData,
    ...config,
    ready: true,
  };
};

/**
 * use: methods方式调用接口
 * 最多维持2层,其余丢弃
 * @param object
 * @param levelLimit
 */
const use = (object, levelLimit) => {
  Object.keys(object).map(index => {
    switch (typeof object[index]) {
      case 'function':
        if (!levelLimit) {
          request.requestApi[index] = params => {
            const config = object[index](params);
            return request(config);
          };
        } else {
          request.requestApi[levelLimit][index] = params => {
            const config = object[index](params);
            return request(config);
          };
        }
        break;
      case 'object':
        // eslint-disable-next-line
        const objectType = Object.prototype.toString.call(object[index]);
        if (objectType === '[object Object]' && !levelLimit) {
          request.requestApi[index] = {};
          use(object[index], index);
        } else {
          _warnIgnore(`${index}`);
        }
        break;
      default:
        _warnIgnore(`${index}`);
        break;
    }
    return object[index];
  });
};

export { consume, request, init, use };
