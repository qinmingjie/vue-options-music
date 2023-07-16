import { ElMessage } from "element-plus";

import { storageAction, customInterval, generatorRouters } from "@/utils/tool";
import { getqrStatus, getUserStatus, getUserDetail } from "@/api/user";
import router, { asyncRoutes } from "@/router/index";

export default {
  state: {
    token: storageAction.getStorage("TOKEN"),
    isSkip: false, // 是否跳过登陆
    info: null, // 用户信息
    clear: null
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
    SET_CLEAR_INTERVAL(state, clear) {
      state.clear = clear;
    },
    REMOVE_CUSINTERVAL(state) {
      state.clear && state.clear();
    }
  },
  actions: {
    // 获取用户授权状态
    async getAuthStatus({ commit }, unikey) {
      return new Promise((resolve) => {
        const clearCusTimeout = customInterval(async () => {
          commit("SET_CLEAR_INTERVAL", clearCusTimeout);
          try {
            const res = await getqrStatus({ key: unikey });
            const { code, cookie = "" } = res.data;

            // 如果返回的code是800则是二维码过期返回{status: false}用于展示刷新二维码
            if (code === 800) {
              return resolve({ status: false });
            }
            // 授权成功写入storage返回{staus: true}用于展示刷新二维码
            if (code === 803) {
              storageAction.setStorage("TOKEN", cookie);
              storageAction.setStorage("CREATE_TIME", new Date().getTime());
              storageAction.setStorage("THEME", "default");
              commit("SET_TOKEN", cookie);
              ElMessage.success("登陆成功!");
              return resolve({ status: true });
            }
          } catch (error) {
            resolve({ error, status: false });
            throw new Error(error);
          }
        }, 1000);
      });
    },
    // 获取用户信息
    async getUserInfo({ commit }) {
      try {
        const { data } = await getUserStatus();
        const res = await getUserDetail({ uid: data?.data?.account?.id });
        if (res.data.profile) {
          res.data.profile.roles = ["admin"];
          commit("SET_INFO", res.data.profile);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 设置异步路由
    async setAsyncRouter({ dispatch, getters }) {
      await dispatch("getUserInfo");
      const accessRouter = generatorRouters(asyncRoutes, getters.userRoles);
      await accessRouter.forEach((item) => {
        router.addRoute("home", item);
      });
    }
  },
  getters: {
    userRoles(state) {
      return state.info?.roles || [];
    }
  }
};
