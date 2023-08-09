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

// 获取所有排行榜
export function getToplist(params) {
  return request({
    url: "/toplist",
    method: "GET",
    params
  });
}

// 获取歌单详情
export function getPlaylistDetail(params) {
  return request({
    url: "/playlist/detail",
    method: "GET",
    params
  });
}

// 获取歌单分类
export function playlistCatlist(params) {
  return request({
    url: "/playlist/catlist",
    method: "GET",
    params
  });
}

// 获取热门歌单分类
export function hotPlaylistCategory(params) {
  return request({
    url: "/playlist/hot",
    method: "GET",
    params
  });
}

// 获取精品歌单
export function highquality(params) {
  return request({
    url: "/top/playlist/highquality",
    method: "GET",
    params
  });
}

// 获取分类下的歌单
export function playlistUnderCategory(params) {
  return request({
    url: "/top/playlist",
    method: "GET",
    params
  });
}

// 获取歌单下的所有歌曲
export function playlistTrackAll(params) {
  return request({
    url: "/playlist/track/all",
    method: "GET",
    params
  });
}
