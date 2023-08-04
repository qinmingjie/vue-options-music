import { createRouter, createWebHistory } from "vue-router";

import Layout from "@/layout/index.vue";
import { example as LoginApp } from "@/components/login/index";
import { getStatus } from "@/utils/tool";
import store from "@/store/index";

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
        meta: { title: "发现音乐", isAsideMenu: true, requiresAuth: false },
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
        meta: {
          title: "歌单详情",
          isAsideMenu: false,
          requiresAuth: false
        }
      },
      {
        path: "song-detail/:id",
        name: "song-detail",
        component: () => import("@/views/song-detail/index.vue"),
        meta: {
          title: "歌曲详情",
          isAsideMenu: false,
          requiresAuth: false
        }
      },
      {
        path: "artist-detail/:id",
        name: "artist-detail",
        component: () => import("@/views/artist-detail/index.vue"),
        meta: {
          title: "歌手详情",
          isAsideMenu: false,
          requiresAuth: false
        }
      },
      {
        path: "album-detail/:id",
        name: "album-detail",
        component: () => import("@/views/album-detail/index.vue"),
        meta: {
          title: "专辑详情",
          isAsideMenu: false,
          requiresAuth: false
        }
      },
      {
        path: "/search",
        name: "search",
        component: () => import("@/views/search/index.vue"),
        meta: { title: "搜索", isAsideMenu: false, requiresAuth: false },
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
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page404",
    component: () => import("@/views/404.vue"),
    meta: { title: "404 Not Found!", isAsideMenu: false, requiresAuth: false }
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
      requiresAuth: true,
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
      requiresAuth: true,
      roles: ["admin"]
    }
  },
  {
    path: "/favourite",
    name: "favourite",
    component: () => import("@/views/favourite/index.vue"),
    meta: {
      title: "我喜欢的音乐",
      isAsideMenu: true,
      requiresAuth: true,
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
      menuDisabled: true,
      requiresAuth: true,
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
      menuDisabled: true,
      requiresAuth: true,
      roles: ["admin"]
    }
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

let isAdd = false;
router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.title || "music";
  const isLogin = getStatus();
  if (isLogin) {
    if (!isAdd) {
      await store.dispatch("setAsyncRouter");
      isAdd = true;
      return next(to.fullPath);
    }
    next();
  } else {
    if (!store.state.user.isSkip) {
      await LoginApp.open();
      return next(to.fullPath);
    }
    next();
  }
});

export default router;
