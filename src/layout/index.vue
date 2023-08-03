<template>
  <div class="layout-comp">
    <el-container>
      <el-header class="cm-header">
        <HeaderComp v-model="isExpand" />
      </el-header>
      <el-container class="cm-content">
        <el-aside class="cm-aside">
          <AsideComp />
        </el-aside>
        <el-main class="cm-main">
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer class="cm-footer"></el-footer>
    </el-container>
    <el-drawer
      v-model="isExpand"
      :with-header="false"
      direction="ltr"
      size="200px"
      :before-close="closeAside"
      class="aside-drawer"
    >
      <AsideComp />
    </el-drawer>
  </div>
</template>

<script>
import HeaderComp from "@/components/header/index.vue";
import AsideComp from "@/components/aside/index.vue";
export default {
  name: "LayoutIndex",
  components: { HeaderComp, AsideComp },
  data() {
    return {
      isExpand: false
    };
  },
  methods: {
    closeAside() {
      this.isExpand = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.cm-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.cm-header {
  background-color: var(--cm-header-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  color: var(--cm-header-text-color);
}
.cm-content {
  background-color: var(--cm-content-bg-color);
}
.cm-main {
  height: calc(100vh - 120px);
  padding-bottom: 4px;
  box-sizing: border-box;
  padding-right: 0;
  .el-scrollbar,
  ::deep(.el-scrollbar__view) {
    height: 100%;
  }
}
.el-scrollbar {
  padding-right: 20px;
}
.cm-footer {
  border-top: 1px solid var(--el-border-color);
  background-color: var(--cm-footer-bg-color);
}
.cm-aside {
  width: 200px;
  height: calc(100vh - 120px);
  transition: transform 0.5s;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color);
}
.el-drawer__body {
  padding-top: 100px;
}
@media (max-width: 1200px) {
  .cm-aside {
    width: 0;
    padding: 0;
    transition: width 0.5s;
    transform: translateX(-100%);
  }
  .cm-header {
    padding: 0 15px;
  }
  .el-scrollbar {
    padding-right: 15;
  }
  .cm-footer {
    padding: 0 15px;
  }
}
</style>
