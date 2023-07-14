<template>
  <div class="header-right-flex">
    <template v-if="true">
      <div class="user" @click="$router.push('/profile')">
        <el-avatar src="" :size="30" />
        <el-tooltip content="info.nickname" placement="bottom">
          <span class="nick-name"></span>
        </el-tooltip>
      </div>
    </template>
    <template v-if="true">
      <span class="login">登陆</span>
    </template>
    <div class="action-flex">
      <el-switch
        v-model="theme"
        inline-prompt
        active-value="default"
        inactive-value="dark"
        @change="toggleTheme"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "profileComp",
  components: {},
  data() {
    return {
      theme: "default"
    };
  },
  methods: {
    toggleTheme(val) {
      this.$nextTick(() => {
        const html = document.documentElement || document.querySelector("html");
        html.setAttribute("class", val);
      });
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
