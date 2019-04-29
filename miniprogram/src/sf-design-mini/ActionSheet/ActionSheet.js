import { createAnimation } from '../tools';
import { widthCoefficient, animationDuration, animationDelay } from '../config';

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    confirm: { type: Boolean, value: false },
    cancel: { type: Boolean, value: false },
    title: { type: String, value: '' },
    // 内容高度 单位rpx
    height: {
      type: Number,
      value: 0,
      observer(newValue) {
        // 计算实际高度
        const { confirm, cancel, title } = this.data;
        this.setData({
          operatingAreaHeight: confirm || cancel || title ? newValue + 110 : newValue,
        });
      },
    },
    // 控制动画执行
    visible: {
      type: Boolean,
      value: false,
      observer(newValue) {
        if (newValue) {
          this._showActionSheet();
        } else {
          this._hideActionSheet();
        }
      },
    },
  },
  data: {
    show: false, // 不允许直接设置show的值
    operatingAreaHeight: 0, // 弹窗高度
    animationMask: {},
    animationOperatingArea: {},
  },
  attached() {
    // 创建2个动画对象到this
    this.animationOA = createAnimation();
    this.animationM = createAnimation();
  },
  methods: {
    confirmEvent() {
      this.triggerEvent('confirmEvent');
    },
    cancelEvent() {
      this.triggerEvent('cancelEvent');
    },
    // 不允许直接调用此函数，请使用 cancelEvent
    _hideActionSheet() {
      this.animationM.opacity(0).step();
      this.animationOA.translateY(0).step();
      this.setData(
        {
          animationMask: this.animationM.export(),
          animationOperatingArea: this.animationOA.export(),
        },
        () => {
          setTimeout(() => {
            this.setData({ show: false });
          }, animationDuration);
        },
      );
    },
    // 不允许直接调用此函数，请使用 confirmEvent
    _showActionSheet() {
      this.setData({ show: true }, () => {
        setTimeout(() => {
          this.animationM.opacity(0.4).step();
          this.animationOA.translateY(-this.data.operatingAreaHeight / widthCoefficient).step();
          this.setData({
            animationMask: this.animationM.export(),
            animationOperatingArea: this.animationOA.export(),
          });
        }, animationDelay);
      });
    },
    stopPageScroll() {},
  },
});
