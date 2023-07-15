import { createApp } from "vue";
import loginComp from "./index.vue";
import { storageAction } from "@/utils/tool";
const loginApp = createApp(loginComp);
const expires = import.meta.env.VITE_EXPIRES;

function getStatus() {
  const token = storageAction.getStorage("TOKEN");
  const createTime = storageAction.getStorage("CREATE_TIME");
  const timeDifference = new Date().getTime() - createTime;
  let loginStatus = false;
  if (token && timeDifference < expires) {
    loginStatus = true;
  }
  return loginStatus;
}

export default {
  install: (app) => {
    let example = null;
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
