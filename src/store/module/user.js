import { ElMessage } from "element-plus";

import { storageAction, customInterval } from "@/utils/tool";
import { getqrStatus } from "@/api/user";

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
              storageAction.setStorage("CREATE_NAME", new Date().getTime());
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
    }
  }
};
