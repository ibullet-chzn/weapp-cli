import { connect } from '../lib/wechat-weapp-redux.min';
import { withStore } from '../lib/retalk';
import store from './index';

/**
 * 提供一个静态方法 解决 request store 相互调用的问题
 */
class Store {
  static all() {
    return connect(
      ...withStore('Common', 'Address'),
      store,
    )({});
  }
}

/**
 * 解决store在非page页面无法使用而额外提供的函数
 * !!! wechat-weapp-redux 依赖库有修改 (connect 方法有兼容性修改) !!!
 */
export default Store;
