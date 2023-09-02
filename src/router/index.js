import { createRouter, createWebHistory } from "vue-router";

import Layout from "@/layout/index.vue";
import { getStatus } from "@/utils/tool";
import store from "@/store/index";
/*
 * meta字段
 * title:标题,isAsideMenu是否是侧边栏菜单
 * isAuth:是否需要登陆访问,isCustomMenu:菜单是否需要自定义
 */
const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/find",
    component: Layout,
    children: [
      {
        path: "/find",
        name: "find",
        component: () => import("@/views/find/index.vue"),
        meta: { title: "发现音乐", isAsideMenu: true },
        redirect: "/find/recommend",
        children: [
          {
            path: "recommend",
            name: "recommend",
            component: () => import("@/views/find/recommend.vue"),
            meta: { title: "热门推荐" }
          },
          {
            path: "rank-list",
            name: "rank-lint",
            component: () => import("@/views/find/rank-list.vue"),
            meta: { title: "排行榜" }
          },
          {
            path: "playlist",
            name: "playlist",
            component: () => import("@/views/find/playlist.vue"),
            meta: { title: "歌单" }
          },
          {
            path: "singer-list",
            name: "singer-list",
            component: () => import("@/views/find/singer-list.vue"),
            meta: { title: "歌手" }
          },
          {
            path: "new-disc",
            name: "new-disc",
            component: () => import("@/views/find/new-disc.vue"),
            meta: { title: "新碟上架" }
          }
        ]
      },
      {
        path: "playlist-detail/:id",
        name: "playlist-detail",
        component: () => import("@/views/playlist-detail/index.vue"),
        meta: { title: "歌单详情" }
      },
      {
        path: "song-detail/:id",
        name: "song-detail",
        component: () => import("@/views/song-detail/index.vue"),
        meta: { title: "歌曲详情" }
      },
      {
        path: "artist-detail/:id",
        name: "artist-detail",
        component: () => import("@/views/artist-detail/index.vue"),
        meta: { title: "歌手详情" }
      },
      {
        path: "album-detail/:id",
        name: "album-detail",
        component: () => import("@/views/album-detail/index.vue"),
        meta: { title: "专辑详情" }
      },
      {
        path: "/search",
        name: "search",
        component: () => import("@/views/search/index.vue"),
        meta: { title: "搜索" },
        children: [
          {
            path: "search-song/:keywords",
            name: "search-song",
            component: () => import("@/views/search/song.vue"),
            meta: { title: "搜索-单曲" }
          },
          {
            path: "search-artist/:keywords",
            name: "search-artist",
            component: () => import("@/views/search/artist.vue"),
            meta: { title: "搜索-歌手" }
          },
          {
            path: "search-album/:keywords",
            name: "search-album",
            component: () => import("@/views/search/album.vue"),
            meta: { title: "搜索-专辑" }
          },
          {
            path: "search-playlist/:keywords",
            name: "search-playlist",
            component: () => import("@/views/search/playlist.vue"),
            meta: { title: "搜索-歌单" }
          }
        ]
      }
    ]
  }
];

export const asyncRoutes = [
  {
    path: "/everyday",
    name: "everyday",
    component: () => import("@/views/everyday/index.vue"),
    meta: {
      title: "每日推荐",
      isAsideMenu: true,
      isAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/profile/index.vue"),
    meta: {
      title: "个人中心",
      isAsideMenu: true,
      isAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/favourite/:id",
    name: "favourite",
    component: () => import("@/views/playlist-detail/index.vue"),
    meta: {
      title: "我喜欢的音乐",
      isAsideMenu: true,
      isCustomMenu: true,
      isAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/create-playlist/:id",
    name: "create-playlist",
    component: () => import("@/views/playlist-detail/index.vue"),
    meta: {
      title: "创建的歌单",
      isAsideMenu: true,
      isCustomMenu: true,
      isAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/collect-playlist/:id",
    name: "collect-playlist",
    component: () => import("@/views/playlist-detail/index.vue"),
    meta: {
      title: "收藏的歌单",
      isAsideMenu: true,
      isCustomMenu: true,
      isAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page404",
    component: () => import("@/views/404.vue"),
    meta: { title: "404 Not Found!", roles: [] }
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.title || "music";
  const isLogin = getStatus();
  if (isLogin) {
    if (!store.state.user.info) {
      await store.dispatch("getUserInfo");
      next(to.fullPath);
    } else {
      next();
    }
  } else {
    if (to.fullPath.indexOf("/find") !== -1) {
      next();
    } else {
      next("/find");
    }
  }
});

export default router;
