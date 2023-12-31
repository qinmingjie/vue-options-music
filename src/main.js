import { createApp } from "vue";
import { ElMessage } from "element-plus";

import router from "./router/index";
import store from "./store/index";
import App from "./App.vue";
import setClientWIdth from "@/plugins/setClientWidth/index";
import "element-plus/theme-chalk/src/message.scss";
import "@/assets/iconfont/iconfont.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElMessage);
app.use(setClientWIdth);
app.mount("#app");
