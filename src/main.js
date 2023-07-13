import { createApp } from "vue";
import { ElMessage } from "element-plus";

import router from "./router/index";
import store from "./store/index";
import App from "./App.vue";
import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElMessage);
app.mount("#app");
