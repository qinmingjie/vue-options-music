import request from "./config";

// 获取二维码key
export function getqrKey() {
  return request({
    url: "/login/qr/key"
  });
}

// 生成二维码
export function getqrCode(params) {
  return request({
    url: "/login/qr/create",
    params,
    isTimeStamp: true
  });
}

// 查询二维码扫码状态
export function getqrStatus(params) {
  return request({
    url: "/login/qr/check",
    params,
    isTimeStamp: true
  });
}

export function getUserStatus(data) {
  return request({
    url: "/login/status",
    method: "POST",
    data,
    isCookie: true
  });
}

export function getUserDetail(params) {
  return request({
    url: "/user/detail",
    method: "GET",
    params,
    isTimeStamp: true
  });
}

export function getUserPlaylist(data) {
  return request({
    url: "/user/playlist",
    method: "POST",
    data,
    isCookie: true
  });
}

export function loginOut(data) {
  return request({
    url: "/logout",
    method: "POST",
    data,
    isCookie: true
  });
}
