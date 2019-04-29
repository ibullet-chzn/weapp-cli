Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    // 宽度高度默认值为0,取auto
    // 为保证展示效果，粗暴的限制用户设置宽高不能小于200
    // 暂不支持设置百分比等其他单位
    width: { type: Number, value: 0 },
    height: { type: Number, value: 0 },
    // 可强行定义loading位置
    top: { type: Number, value: -1 },
    // 是否文案/仅动画
    tip: { type: String, value: '' },
    // 是否loading
    visible: { type: Boolean, value: false },
    // 是否遮罩 默认:是
    mask: { type: Boolean, value: true },
  },
});
