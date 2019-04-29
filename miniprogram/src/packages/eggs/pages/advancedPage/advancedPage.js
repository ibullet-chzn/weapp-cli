// 兼容 async await 写法
// eslint-disable-next-line
import computedBehavior from '../../../../lib/computed';
import propertiesBehavior from '../../../../lib/properties';

const regeneratorRuntime = require('../../../../lib/babel-runtime/regenerator/index');

Component({
  behaviors: [computedBehavior, propertiesBehavior],
  /**
   * 高阶组件支持3种数据类型的直接传递 数据类型不正确时会进行一次转化
   * Number 传递的字符串无法转换为数字时 值为0
   * Boolean 传递空字符串值为false 其余均为true
   * Object/Array 无法转换 值为null 但是可以在onLoad(options)里取到 自己转换
   * so: 提供 propertiesBehavior 专门处理Object/Array数据 只接受Json字符串
   */
  properties: {
    paramA: Number,
    paramB: String,
    paramC: Boolean,
    paramD: Object,
    paramE: Array,
  },
  computed: {
    computedA() {
      return this.data.paramA + 100;
    },
  },
  observers: {
    paramA(paramA) {
      // 在 paramA 被设置时，执行这个函数
      console.log(paramA);
    },
  },
  methods: {
    onLoad(e) {
      // 处理Object/Array数据类型
      this.__parse(e, 'paramD', 'paramE');
    },
  },
});
