// 宽度换算系数 px = rpx / widthCoefficient; rpx = px * widthCoefficient;
const widthCoefficient = 750 / wx.getSystemInfoSync().windowWidth;

// 动画参数
const animationDuration = 250;
const animationDelay = 10; // hack 兼容某些情况下，动画可能不执行的问题

export { widthCoefficient, animationDuration, animationDelay };
