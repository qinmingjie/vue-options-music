<template>
  <div class="header-right-comp">
    <div class="header-right-flex">
      <template v-if="profile">
        <div class="user" @click="$router.push('/profile')">
          <el-avatar :src="profile.avatarUrl" :size="30" />
          <el-tooltip :content="profile.nickname" placement="bottom">
            <span class="nick-name">{{ profile.nickname }}</span>
          </el-tooltip>
        </div>
      </template>
      <span class="login" @click="open" v-if="!profile">登陆</span>
      <div class="action-flex">
        <el-icon @click="toggleTheme('dark')" v-show="theme === 'default'"><IEpSunny /></el-icon>
        <el-icon @click="toggleTheme('default')" v-show="theme === 'dark'"><IEpMoon /></el-icon>
      </div>
    </div>
    <!-- 登陆弹窗 -->
    <el-dialog
      v-model="visible"
      title="登陆"
      class="login-dialog"
      :center="true"
      :append-to-body="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <template #default>
        <div class="qrimg-container">
          <div class="qrimg" v-loading="loading">
            <img :src="qrimg || ''" alt="" />
            <span class="qrimg-mask" v-if="status === false">
              <el-icon><IEpWarningFilled /></el-icon>
            </span>
          </div>
          <el-text class="mx-1" size="small" v-if="status">扫码登陆</el-text>
          <span v-else @click="initQrImg" class="refresh">
            <el-icon><IEpRefresh /></el-icon>
            刷新二维码
          </span>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="cancel">跳过登陆</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getqrKey, getqrCode } from "@/api/user";
export default {
  name: "profileComp",
  components: {},
  data() {
    return {
      theme: "default",
      visible: false,
      qrimg: "", // 二维码图片base64
      status: true, // 二维码状态
      loading: true // 二维码loading
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.info?.profile,
      skip: (state) => state.user.isSkip
    })
  },
  methods: {
    // 切换主题
    toggleTheme(val) {
      this.$nextTick(() => {
        const html = document.documentElement || document.querySelector("html");
        this.theme = val;
        html.setAttribute("class", val);
      });
    },
    async open() {
      this.visible = true;
      await this.initQrImg();
    },
    async cancel() {
      this.visible = false;
      this.$store.commit("CLEAR_INTERVAL");
      this.$store.commit("SET_SKIP", true);
      this.$router.replace("/");
    },
    async authSuccess() {
      this.visible = false;
      this.$store.dispatch("getUserInfo");
    },
    // 获取key
    async handleQrKey() {
      const qrKeyResult = await getqrKey();
      const { unikey } = qrKeyResult.data.data;
      return unikey;
    },

    // 获取base64
    async handleQrImg(unikey) {
      const qrResult = await getqrCode({ key: unikey, qrimg: true });
      const { qrimg } = qrResult.data.data;
      return qrimg;
    },

    // 初始化二维码并检查二维码状态
    async initQrImg() {
      this.loading = this.status = true;

      try {
        // 获取二维码图片
        const unikey = await this.handleQrKey();
        const qrimg = await this.handleQrImg(unikey);
        this.loading = false;

        // 初始化二维码和轮询检查二维码状态
        this.qrimg = qrimg;
        const { status = true } = await this.$store.dispatch("getAuthStatus", unikey);
        this.status = status;
        status && this.authSuccess();
        this.$store.commit("CLEAR_INTERVAL");
      } catch (error) {
        this.status = false;
        this.loading = false;
        this.$store.commit("CLEAR_INTERVAL");
        console.error(error);
      }
    }
  },
  watch: {
    skip: {
      handler(newVal) {
        !newVal && !this.profile && this.open();
      },
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
.header-right-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--el-font-size-base);
}
.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 5px;
  cursor: pointer;
  .el-avatar {
    margin-right: 5px;
  }
  .nick-name {
    display: block;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 2px;
  }
}
.login {
  margin: 0 10px 2px 0;
  cursor: pointer;
}
.action-flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-icon {
  cursor: pointer;
  margin-right: 10px;
}
.el-switch {
  .el-icon {
    margin-right: 0;
  }
  :deep(.el-switch__core) {
    background-color: var(--cm-placeholder-color);
    border: 0;
  }
}
@media (max-width: 768px) {
  .user {
    .nick-name {
      display: none;
    }
  }
}
</style>
