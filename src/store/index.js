import { createStore } from "vuex";

import userState from "./module/user";
import songState from "./module/song";

export default createStore({
  modules: {
    user: userState,
    song: songState
  }
});
