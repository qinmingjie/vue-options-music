import { createStore } from "vuex";

import userState from "./module/user";

export default createStore({
  modules: {
    user: userState
  }
});
