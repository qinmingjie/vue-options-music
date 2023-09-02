<template>
  <el-scrollbar>
    <el-menu class="cm-menu" router unique-opened :default-active="defaultActive">
      <el-menu-item v-for="menu in menus" :key="menu.name" :index="menu.path">
        {{ menu.title }}
        <template v-if="menu.children && menu.children.length">
          <el-sub-menu :index="menu.path">
            <el-menu-item v-for="childMenu in menu.children" :key="childMenu.name" :index="childMenu.path">
              {{ childMenu.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu-item>
      <template v-for="menu in customMenu" :key="menu.name">
        <!-- 歌单：喜欢的音乐 -->
        <el-menu-item
          v-if="favouritePlaylist && menu.name === 'favourite'"
          :index="replaceRouteId(menu.path, favouritePlaylist.id)"
        >
          {{ menu.title }}
        </el-menu-item>
        <!-- 歌单组：创建的歌单 -->
        <el-sub-menu v-if="otherCreatePlaylist.length && menu.name === 'create-playlist'" :index="menu.name">
          <template #title>{{ menu.title }}</template>
          <el-menu-item
            v-for="createItem in otherCreatePlaylist"
            :key="createItem.id"
            :index="replaceRouteId(menu.path, createItem.id)"
          >
            {{ createItem.name }}
          </el-menu-item>
        </el-sub-menu>
        <!-- 歌单组：收藏的歌单 -->
        <el-sub-menu v-if="collectPlaylist.length && menu.name === 'collect-playlist'" :index="menu.name">
          <template #title>{{ menu.title }}</template>
          <el-menu-item
            v-for="collectItem in collectPlaylist.slice(1)"
            :key="collectItem.id"
            :index="replaceRouteId(menu.path, collectItem.id)"
          >
            {{ collectItem.name }}
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
  props: {
    defaultActive: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      menus: [],
      customMenu: []
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
    },
    favouritePlaylist() {
      return this.createPlaylist.slice(0, 1)[0];
    },
    otherCreatePlaylist() {
      return this.createPlaylist.slice(1);
    }
  },
  methods: {
    ...mapActions({
      handlePlaylist: "handlePlaylist"
    }),
    // 根据动态路由设置相关菜单
    routesToMenu(routes) {
      let defaultMenu = [];
      const customMenu = [];
      let menus = [];
      let childrenArr = [];
      routes.forEach((route) => {
        const menuItem = {
          title: route.meta.title,
          path: route.path,
          name: route.name
        };
        if (route.children && route.children.length) {
          menuItem.children = this.routesToMenu(route.children);
          // 所有的children路由
          route.children.forEach((childItem) => {
            childItem.meta && childItem.meta.isAsideMenu && childrenArr.push(childItem);
          });
        }
        // 压入相关路由路由
        route.meta && route.meta.isAsideMenu && menus.push(menuItem);
        route.meta && route.meta.isCustomMenu && route.meta.isAsideMenu && customMenu.push(menuItem);
        route.meta && !route.meta.isCustomMenu && route.meta.isAsideMenu && defaultMenu.push(menuItem);
      });

      // 因为routes是通过getRoutes获取的，一些子路由被放在了routes数组中，所以需要剔除这些子路由
      menus = menus.filter((item) => !childrenArr.some((childRoute) => childRoute.name === item.name));

      this.customMenu = customMenu;
      this.menus = defaultMenu;
      return menus;
    },
    // 替换路由的中指定字符
    replaceRouteId(routeStr, data) {
      return routeStr.replace(":id", data);
    }
  },
  created() {},
  mounted() {},
  watch: {
    info: {
      async handler(newVal) {
        await this.routesToMenu(this.$router.getRoutes());
        newVal && (await this.handlePlaylist());
      },
      immediate: true,
      deep: true
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
  :deep(.el-menu) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item,
  &:not(.el-menu--collapse):not(.el-menu--popup-container) :deep(.el-sub-menu__title) {
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
    :deep(.el-sub-menu__title) {
      margin-bottom: 10px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.95em;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
