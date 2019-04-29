Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    coupon: { type: Array, value: [] },
    visible: { type: Boolean, value: false },
  },
  data: {},
  methods: {
    cancelEvent() {
      this.triggerEvent('cancelEvent');
    },
  },
});
