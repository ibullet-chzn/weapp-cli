import { animationDuration } from './config';
// 创建动画
const createAnimation = (type = 'ease', duration) => wx.createAnimation({
  duration: duration || animationDuration,
  timingFunction: type,
});

// 动画参数

export { createAnimation };
