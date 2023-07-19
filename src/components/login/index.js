import { createApp } from "vue";
import loginComp from "./index.vue";
import { getStatus } from "@/utils/tool";

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
    }
  }
};
