import axios from "axios";
import { storageActions } from "@/utils/tool";
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
    const cookie = storageActions.get("USER")?.token;
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

request.interceptors.response.use(
  (config) => {
    const code = config.data.code;
    // 服务器响应状态码判断
    if (code && code !== 200 && !(code >= 801 && code <= 803)) {
      ElMessage.error(
        config.data?.msg || `code:${code}, 未知错误,请联系管理员!`
      );
    }
    return config;
  },
  (error) => {
    // if (error.response) {
    //   ElMessage.error(
    //     `${error.response.status} ${
    //       error.response.message || "未知错误,请联系管理员!"
    //     }`
    //   );
    // } else {
    //   ElMessage.error(error.message);
    // }
    return Promise.reject(error);
  }
);

export default request;
