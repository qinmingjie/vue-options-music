import { ref } from "vue";
import { throttle, getStatus } from "@/utils/tool";

export let example = null;

// 挂载登陆弹窗
export default {
  install: (app) => {
    app.config.globalProperties.$isLogin = getStatus;
    // 写入视口宽度属性
    let el = document.documentElement || document.body;
    let width = ref(el.clientWidth);
    app.config.globalProperties.$clientWidth = width;
    window.onresize = throttle(() => {
      width.value = el.clientWidth;
      app.config.globalProperties.$clientWidth = width;
    }, 100);
  }
};
