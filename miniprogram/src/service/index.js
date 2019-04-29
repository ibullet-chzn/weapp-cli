/*
 * 调用基础支持 lib/request
 * */

import { init, use, request } from '../lib/request';

init({
  host: 'https://shopic.sf-express.com',
});

const getData = params => ({
  url: '/customer/judgeopen',
  type: 'GET',
  params,
  keepLogin: true,
  fingerprint: true,
});

const user = {
  getInfo(params, keepLogin = false) {
    return {
      url: '/getUserInfo',
      type: 'GET',
      params,
      keepLogin,
    };
  },
};

use({ getData });
use({ user });

export default request;
