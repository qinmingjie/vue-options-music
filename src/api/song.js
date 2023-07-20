import request from "./config";

// 获取推荐歌单(非登陆状态)
export function getRecommendPlaylist(params) {
  return request({
    url: "/personalized",
    method: "GET",
    params
  });
}

// 获取推荐歌单(登陆状态下)
export function getLoginRecommendPlaylist(params) {
  return request({
    url: "/recommend/resource",
    method: "post",
    params,
    isCookie: true
  });
}
