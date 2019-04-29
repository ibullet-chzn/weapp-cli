/*
 * 统一对外输出api
 * 保证入参出参的一致性
 * 收敛权限问题 */

import weLogin from './weApi/login';
import weRequest from './weApi/request';
import * as clipboard from './weApi/clipboard';
import * as location from './weApi/location';
import * as system from './weApi/system';
import * as network from './weApi/network';

// todo:login未完成
const login = () => weLogin();

const request = ({
  url = '', type = 'GET', params = {}, header,
}) => weRequest({
  url, data: params, method: type, header,
});

const getClipboardData = () => clipboard.getClipboardData();

const setClipboardData = data => clipboard.setClipboardData(data);

const getLocation = type => location.getLocation(type);

const getSystemInfo = () => system.getSystemInfo();

const getNetworkType = () => network.getNetworkType();

const onNetworkStatusChange = callback => network.onNetworkStatusChange(callback);

export {
  login,
  request,
  getClipboardData,
  setClipboardData,
  getLocation,
  getSystemInfo,
  getNetworkType,
  onNetworkStatusChange,
};
