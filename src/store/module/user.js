import { ElMessage } from "element-plus";

import { storageAction, customInterval, generatorRouters } from "@/utils/tool";
import { getqrStatus, getUserStatus, getUserDetail, getUserPlaylist, loginOut } from "@/api/user";
import router, { asyncRoutes } from "@/router/index";
import { example as loginApp } from "@/plugins/login";

export default {
  state: {
    token: storageAction.getStorage("TOKEN"),
    isSkip: false, // 是否跳过登陆
    info: null, // 用户信息
    clear: null, // 二维码轮询计时器清除
    createPlaylist: [], // 用户创建的歌单
    collectPlaylist: [] // 用户收藏的歌单
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_INFO(state, info) {
      state.info = info;
    },
    SET_SKIP(state, skip) {
      state.isSkip = skip;
    },
    SET_INTERVAL(state, clear) {
      state.clear = clear;
    },
    CLEAR_INTERVAL(state) {
      state.clear && clearInterval(state.clear);
    },
    SET_CREATE_PLAYLIST(state, playlist) {
      state.createPlaylist.push(playlist);
    },
    SET_COLLECT_PLAYLIST(state, collect) {
      state.collectPlaylist.push(collect);
    },
    CLEAR_LOGIN_STATUS(state) {
      storageAction.clearStorage();
      state.token = "";
      state.isSkip = false;
      state.info = null;
      state.createPlaylist = [];
      state.collectPlaylist = [];
    }
  },
  actions: {
    // 获取用户授权状态
    async getAuthStatus({ commit }, unikey) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          commit("SET_INTERVAL", interval);
          try {
            const res = await getqrStatus({ key: unikey });
            const { code, cookie = "" } = res.data;

            // 如果返回的code是800则是二维码过期返回{status: false}用于展示刷新二维码
            if (code === 800) {
              resolve({ status: false });
            }
            // 授权成功写入storage返回{staus: true}用于展示刷新二维码
            if (code === 803) {
              storageAction.setStorage("TOKEN", cookie);
              storageAction.setStorage("CREATE_TIME", new Date().getTime());
              storageAction.setStorage("THEME", "default");
              commit("SET_TOKEN", cookie);
              ElMessage.success("登陆成功!");
              resolve({ status: true });
            }
          } catch (error) {
            reject({ error, status: false });
            // throw new Error(error);
          }
        }, 1000);
      });
    },
    // 获取用户信息
    async getUserInfo({ dispatch, commit }) {
      try {
        const status = await getUserStatus();
        const { data } = status?.data || {};
        // if (data && !data?.account && !data?.profile) {
        //   await loginApp.open();
        //   return;
        // }
        const res = await getUserDetail({ uid: data?.account?.id });
        if (res.data.profile) {
          res.data.roles = ["admin"];
          commit("SET_INFO", res.data);
          dispatch("setAsyncRouter");
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 设置异步路由
    async setAsyncRouter({ getters }) {
      const accessRouter = generatorRouters(asyncRoutes, getters.userRoles);
      await accessRouter.forEach((item) => {
        if (item.name === "page404") {
          router.addRoute(item);
        } else {
          router.addRoute("home", item);
        }
      });
    },
    // 获取用户歌单
    async handlePlaylist({ state, commit }) {
      const res = await getUserPlaylist({ uid: state.info?.profile.userId });
      const playlist = res.data.playlist || [];
      state.createPlaylist = [];
      state.collectPlaylist = [];
      playlist.forEach((item) => {
        item.subscribed && commit("SET_COLLECT_PLAYLIST", item);
        !item.subscribed && commit("SET_CREATE_PLAYLIST", item);
      });
    },
    async loginOut({ commit }) {
      const res = await loginOut();
      const { code = "" } = res?.data || {};
      if (code === 200) {
        ElMessage.success("已退出当前账户");
        commit("CLEAR_LOGIN_STATUS");
        location.reload();
        router.push("/");
      }
    }
  },
  getters: {
    userRoles(state) {
      return state.info?.roles || [];
    }
  }
};
