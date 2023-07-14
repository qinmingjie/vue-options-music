import axios from "axios";
import { storageAction } from "@/utils/tool";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: "http://www.qinmj.top:8882",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  method: "GET",
  withCredentials: true
});

request.interceptors.request.use(
  (config) => {
    const { isTimeStamp, isCookie } = config;
    const cookie = storageAction.getStorage("TOKEN");
    // 添加cookie和timestamp
    if (config.method === "get") {
      !config.params && (isTimeStamp || isCookie) && (config.params = {});
      isTimeStamp && (config.params.timestamp = new Date().getTime());
      isCookie && (config.params.cookie = cookie);
    }
    if (config.method === "post") {
      !config.data && (isTimeStamp || isCookie) && (config.data = {});
      isTimeStamp && (config.data.timestamp = new Date().getTime());
      isCookie && (config.data.cookie = cookie);
    }
    return config;
  },
  (error) => {
    return Promise(error);
  }
);
let errorLive = null;
request.interceptors.response.use(
  (config) => {
    const code = config.data.code;
    const message = config.data?.msg || config.data?.message || "未知错误!";
    // 服务器响应状态码判断
    if (code && code !== 200 && !(code >= 801 && code <= 803)) {
      ElMessage.error(`${code} ${message}`);
    }
    return config;
  },
  (error) => {
    // 防止多个接口错误同时弹出太多错误弹窗
    if (!errorLive) {
      errorLive = ElMessage({
        type: "error",
        message: error.message,
        onClose() {
          errorLive = null;
        }
      });
    }
    return Promise.reject(error);
  }
);

export default request;
