<template>
  <el-scrollbar>
    <el-menu class="cm-menu" router unique-opened :default-active="activePath">
      <el-menu-item v-for="menu in menus" :key="menu.name" :index="menu.path" :disabled="menu.disabled">
        {{ menu.title }}
        <template v-if="menu.children && menu.children.length">
          <el-sub-menu :index="menu.path">
            <el-menu-item v-for="childMenu in menu.children" :key="childMenu.name" :index="childMenu.path">
              {{ childMenu.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu-item>

      <!-- 创建的歌单 -->
      <template v-if="createPlaylist.length">
        <el-sub-menu
          v-for="item in subMenu.filter((item) => item.name === 'create-playlist')"
          :key="item.name"
          :index="item.name"
        >
          <template #title>{{ item.title }}</template>
          <el-scrollbar>
            <el-menu-item
              v-for="createItem in createPlaylist"
              :key="createItem.id"
              :index="'/' + item.name + '/' + createItem.id"
            >
              {{ createItem.name }}
            </el-menu-item></el-scrollbar
          >
        </el-sub-menu>
      </template>
      <!-- 收藏的歌单 -->
      <template v-if="collectPlaylist.length">
        <el-sub-menu
          v-for="item in subMenu.filter((item) => item.name === 'collect-playlist')"
          :key="item.name"
          :index="item.name"
        >
          <template #title>{{ item.title }}</template>
          <el-menu-item
            v-for="createItem in collectPlaylist"
            :key="createItem.id"
            :index="'/' + item.name + '/' + createItem.id"
          >
            {{ createItem.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "AsideIndex",
  props: {},
  components: {},
  data() {
    return {
      menus: [],
      subMenu: []
    };
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info,
      createPlaylist: (state) => state.user.createPlaylist,
      collectPlaylist: (state) => state.user.collectPlaylist
    }),
    routes() {
      return this.$router.getRoutes().filter((item) => item.meta && item.meta.isAsideMenu === true);
    },
    activePath() {
      if (this.$route.path.search("find") !== -1) {
        return "/find";
      }
      return this.$route.path;
    }
  },
  methods: {
    ...mapActions({
      handlePlaylist: "handlePlaylist"
    }),
    // 菜单
    handleMenu(routes) {
      const menu = [];
      const subMenu = [];
      const childrenArr = [];
      routes.forEach((route) => {
        let menuItem = {
          title: route.meta.title,
          path: route.path,
          name: route.name
        };
        if (route.children && route.children.length) {
          menuItem.children = this.handleMenu(route.children);
          // childrenArr放置所有的子路由,getRoutes获取的列表是所有路由包括子路由,这里拿到所有子路由从menu中剔除掉
          route.children.forEach((childItem) => {
            childItem.meta && childItem.meta.isAsideMenu && childrenArr.push(childItem);
          });
        }
        route.meta && route.meta.menuDisabled && subMenu.push(menuItem);
        route.meta && !route.meta.menuDisabled && route.meta.isAsideMenu && menu.push(menuItem);
      });
      this.subMenu = subMenu;
      this.menus = menu.filter((item) => !childrenArr.some((child) => child.name === item.name));
      return menu;
    }
  },
  created() {},
  mounted() {},
  watch: {
    info: {
      async handler(newVal) {
        await this.handleMenu(this.routes);
        newVal && (await this.handlePlaylist());
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.el-scrollbar {
  padding-right: 15px;
}
.cm-menu {
  width: 100%;
  border: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  li,
  ::v-deep(.el-menu) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item,
  &:not(.el-menu--collapse):not(.el-menu--popup-container) ::v-deep(.el-sub-menu__title) {
    padding: 0 0 0 10px;
  }
  .el-menu-item {
    display: block;
    margin-bottom: 10px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.95em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-sub-menu {
    ::v-deep(.el-sub-menu__title) {
      margin-bottom: 10px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.95em;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
