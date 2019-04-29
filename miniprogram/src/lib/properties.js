module.exports = Behavior({
  methods: {
    __parse(options, ...type) {
      type.map(key => {
        try {
          const data = JSON.parse(options[key]);
          const dataType = Object.prototype.toString.call(data);
          console.log(dataType);
          if (dataType === '[object Object]' || dataType === '[object Array]') {
            this.setData({ [key]: data });
          }
        } catch (e) {
          console.warn(e);
        }
        return options[key];
      });
    },
  },
});
