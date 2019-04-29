import { connect } from '../lib/wechat-weapp-redux.min';
import { withStore } from '../lib/retalk';
import store from './index';

/**
 * 未解决store在非page页面无法使用而额外提供的函数
 * !!! wechat-weapp-redux 依赖库有修改 (connect 方法有兼容性修改) !!!
 */
export default connect(
  ...withStore('common'),
  store,
)({});
