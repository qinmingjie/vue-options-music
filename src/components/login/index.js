import { createApp } from "vue";
import loginComp from "./index.vue";
const loginApp = createApp(loginComp);

export default {
  install: (app) => {
    let example = null;
    if (!example) {
      const div = document.createElement("div");
      div.setAttribute("class", "login-dialog");
      document.body.insertAdjacentElement("afterend", div);
      example = loginApp.mount(".login-dialog");
      app.config.globalProperties.$login = example;
    }
  }
};
