<template>
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
</template>

<script>
import { getqrKey, getqrCode } from "@/api/user";
import store from "@/store/index";
export default {
  name: "LoginComp",
  components: {},
  data() {
    return {
      visible: false,
      qrimg: "", // 二维码图片base64
      status: true, // 二维码状态
      loading: true
    };
  },
  created() {},
  mounted() {},
  methods: {
    async open() {
      this.visible = true;
      this.initQrImg();
    },
    cancel() {
      this.visible = false;
      store.commit("REMOVE_CUSINTERVAL");
      store.commit("SET_SKIP", true);
    },
    authSuccess() {
      this.visible = false;
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
      let unikey, qrimg;
      this.loading = this.status = true;

      // 获取二维码图片
      try {
        unikey = await this.handleQrKey();
        qrimg = await this.handleQrImg(unikey);
        this.loading = false;
      } catch (error) {
        this.status = false;
        this.loading = false;
        console.error(error);
        return;
      }

      // 初始化二维码和轮询检查二维码状态
      this.qrimg = qrimg;
      const { status = true } = await store.dispatch("getAuthStatus", unikey);
      this.status = status;
      status && this.authSuccess();
      store.commit("REMOVE_CUSINTERVAL");
    }
  }
};
</script>

<style lang="scss">
.login-dialog {
  width: 300px;
  .el-dialog__header {
    margin-right: 0;
  }
  .qrimg-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    .qrimg {
      width: 150px;
      height: 150px;
      position: relative;
      margin: 0 auto;
    }
    .qrimg-mask {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.9);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .refresh {
    cursor: pointer;
  }
}
</style>
