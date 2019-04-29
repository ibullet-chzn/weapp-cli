import { createAnimation } from '../tools';
import { animationDuration, animationDelay } from '../config';

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
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
    animationMask: {},
    animationOperatingArea: {},
  },
  attached() {
    // 创建2个动画对象到this
    this.animationOA = createAnimation();
    this.animationM = createAnimation();
  },
  methods: {
    cancelEvent() {
      this.triggerEvent('cancelEvent');
    },
    // 不允许直接调用此函数，请使用 cancelEvent
    _hideActionSheet() {
      this.animationM.opacity(0).step();
      this.animationOA.opacity(0).step();
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
          this.animationOA.opacity(1).step();
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
