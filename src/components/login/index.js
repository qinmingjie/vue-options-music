import { createApp, ref } from "vue";
import loginComp from "./index.vue";
import { debouce, getStatus } from "@/utils/tool";

const loginApp = createApp(loginComp);

export let example = null;

// 挂载登陆弹窗
export default {
  install: (app) => {
    app.config.globalProperties.$isLogin = getStatus;
    if (!example) {
      const div = document.createElement("div");
      div.setAttribute("class", "login-dialog");
      document.body.insertAdjacentElement("afterend", div);
      example = loginApp.mount(".login-dialog");
      app.config.globalProperties.$login = example;

      // 写入视口宽度属性
      let el = document.documentElement || document.body;
      let width = ref(el.clientWidth);
      app.config.globalProperties.$clientWidth = width;
      window.onresize = debouce(() => {
        width.value = el.clientWidth;
        app.config.globalProperties.$clientWidth = width;
      }, 200);
    }
  }
};
