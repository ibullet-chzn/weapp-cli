// 兼容 async await 写法
// eslint-disable-next-line
import isVoidObject from '../utils/isVoidObject';
import encrypt from '../utils/encrypt';

import * as api from '../api/index';
import * as storage from '../lib/storage';

const regeneratorRuntime = require('../lib/babel-runtime/regenerator/index');

const common = {
  state: {
    $R_userLocation: {},
    $R_userSystem: {},
  },
  actions: {
    /**
     * 获取用户经纬度
     * @return {Promise<string|*>}
     */
    async $R_getUserLocation() {
      const { $R_userLocation } = this.state;
      if (!isVoidObject($R_userLocation)) {
        return $R_userLocation;
      }
      let location = {};
      try {
        location = await api.getLocation();
        this.setState({ $R_userLocation: location });
      } catch (e) {
        // 是否强制授权
        console.log(e);
      }
      return location;
    },
    async $R_getUserSystem() {
      const { $R_userSystem } = this.state;
      if (!isVoidObject($R_userSystem)) {
        return $R_userSystem;
      }
      let system = {};
      try {
        system = await api.getSystemInfo();
        this.setState({ $R_userSystem: system });
      } catch (e) {
        console.log(e);
      }
      return system;
    },
    async $R_getFingerprint() {
      const result = await Promise.all([
        this.$R_getUserLocation(),
        this.$R_getUserSystem(),
        storage.get('WX_STORAGE_STOKENUSS'),
        api.getNetworkType(),
      ]);
      const fingerprint = {
        ticket: result[2].ticket || '',
        device_name: result[1].brand,
        device_type: result[1].model,
        wx_ver: result[1].version,
        loc_lat: result[0].latitude,
        loc_lng: result[0].longitude,
        net_type: result[3],
        os: result[1].system,
        time: Date.parse(new Date()) / 1000,
      };
      return {
        ac_info: encrypt(JSON.stringify(fingerprint)),
        ac_ver: 1,
        ac_pf: 'tcjs-wxa',
      };
    },
  },
};

export default common;
