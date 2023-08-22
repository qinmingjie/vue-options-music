<template>
  <div>
    <el-row align="middle" justify="start">
      <el-col :span="4" :lg="2" :md="3" class="history-icon">
        <el-icon class="prev" @click="prev"><IEpArrowLeft /></el-icon>
        <el-icon class="next" @click="next"><IEpArrowRight /></el-icon>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="12" :lg="6" :md="8" :xs="20">
        <el-input
          v-model.trim="keywords"
          class="w-50 m-2"
          placeholder="Type something"
          style="width: 100%"
          ref="searchRef"
          @focus="popover = true"
          @input="getSearch"
          v-click-outside="closePopover"
        />
      </el-col>
    </el-row>

    <!-- 搜索弹窗 -->
    <el-popover
      virtual-triggering
      persistent
      ref="hotPopRef"
      width="300px"
      :show-arrow="false"
      :visible="popover"
      :virtual-ref="popoverActionRef"
      :popper-style="{
        padding: 0
      }"
    >
      <div v-loading="loading">
        <el-scrollbar class="popover-scroll" height="56vh">
          <!-- r热搜推荐 -->
          <template v-if="hotList && hotList.length && keywords === ''">
            <div class="hot-conainer">
              <div class="title">热搜榜</div>
              <div
                class="hot-item"
                v-for="(hotItem, index) in hotList"
                :key="index"
                @click="jumpSearch(`/search?keywords=${hotItem.searchWord}`)"
              >
                <span class="hot-item-left" :class="index < 3 ? 'primary' : ''">
                  {{ index + 1 }}
                </span>
                <div class="hot-item-right">
                  <div class="hir-top">
                    <span class="name">{{ hotItem.searchWord }}</span>
                    <img class="hir-icon" :src="hotItem.iconUrl" v-if="hotItem.iconType === 1" />
                    <span class="score">{{ hotItem.score }}</span>
                    <img class="score-icon" :src="hotItem.iconUrl" v-if="hotItem.iconType === 5" />
                  </div>
                  <div class="info">{{ hotItem.content }}</div>
                </div>
              </div>
            </div>
          </template>
          <el-empty v-if="hotList && !hotList.length && keywords === ''"></el-empty>
          <!-- 搜索建议 -->
          <template v-if="keywords && (songs.length || artists.length || albums.length || playlists.length)">
            <div class="suggest-container">
              <!-- 单曲 -->
              <div v-show="songs.length">
                <div class="suggest-title" @click="jumpSearch(`/search/search-song/${keywords}`)">单曲</div>
                <div
                  class="suggest-item"
                  v-for="song in songs"
                  :key="song.id"
                  @click="jumpSearch(`/song-detail/${song.id}`)"
                >
                  {{ song.name }} - {{ artistFilters(song.artists) }}
                </div>
              </div>
              <!-- 歌手 -->
              <div v-show="artists.length">
                <div class="suggest-title" @click="jumpSearch(`/search/search-artist/${keywords}`)">歌手</div>
                <div
                  class="suggest-item"
                  v-for="artist in artists"
                  :key="artist.id"
                  @click="jumpSearch(`/artist-detail/${artist.id}`)"
                >
                  {{ artist.name }}
                </div>
              </div>
              <!-- 专辑 -->
              <div v-show="albums.length">
                <div class="suggest-title" @click="jumpSearch(`/search/search-album/${keywords}`)">专辑</div>
                <div
                  class="suggest-item"
                  v-for="album in albums"
                  :key="album.id"
                  @click="jumpSearch(`/album-detail/${album.id}`)"
                >
                  {{ album.name }} - {{ album.artist?.name }}
                </div>
              </div>
              <!-- 歌单 -->
              <div v-show="playlists.length">
                <div class="suggest-title" @click="jumpSearch(`/search/search-playlist/${keywords}`)">歌单</div>
                <div
                  class="suggest-item"
                  v-for="playlist in playlists"
                  :key="playlist.id"
                  @click="jumpSearch(`/playlist-detail/${playlist.id}`)"
                >
                  {{ playlist.name }}
                </div>
              </div>
            </div>
          </template>
          <el-empty
            v-if="keywords && !(songs.length || artists.length || albums.length || playlists.length)"
          ></el-empty>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { throttle } from "@/utils/tool";
import { searchHot, suggest } from "@/api/song";
import { ClickOutside } from "element-plus";
export default {
  name: "SearchComp",
  components: {},
  data() {
    return {
      loading: false,
      keywords: "",
      popover: false, // 弹窗状态
      popoverActionRef: null, // 表单节点
      hotList: [], // 热搜列表
      albums: [], // 专辑列表
      artists: [], // 歌手列表
      playlists: [], // 歌单列表
      songs: [] // 单曲列表
    };
  },
  created() {
    this.$nextTick(() => {
      this.popoverActionRef = this.$refs.searchRef;
    });
    this.getHotList();
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    next() {
      this.$router.go(1);
    },
    // 获取热搜列表
    async getHotList() {
      this.loading = true;
      try {
        const res = await searchHot();
        if (res.data.code === 200) {
          this.hotList = res.data.data || [];
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    // 获取搜索结果
    getSearch: throttle(async function () {
      if (!this.keywords) {
        return;
      }
      try {
        this.loading = true;
        this.popover = true;
        const res = await suggest({ keywords: this.keywords });
        const { albums = [], artists = [], playlists = [], songs = [] } = res.data.result || {};
        this.albums = albums;
        this.artists = artists;
        this.playlists = playlists;
        this.songs = songs;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    }, 500),
    // 跳转search
    jumpSearch(link) {
      this.$message.info("开发中...");
      // this.$refs.searchRef.blur();
      // this.popover = false;
      // this.$router.push(link);
    },
    closePopover() {
      this.popover = false;
    }
  },
  watch: {},
  directives: {
    ClickOutside // elemenu内部input移除关闭pop指令
  },
  computed: {
    artistFilters() {
      return (val) => {
        return val.map((item) => item.name).join(" ");
      };
    }
  }
};
</script>

<style scoped lang="scss">
.popover-scroll {
}
.history-icon {
  margin-right: 5px;

  .prev,
  .next {
    width: 24px;
    height: 24px;
    font-size: 14px;
    background-color: var(--cm-opacity-bg-color);
    border-radius: 50%;
    cursor: pointer;
  }
  .prev {
    margin-right: 8px;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 50px;
  background-color: var(--cm-opacity-bg-color);
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }
  input {
    outline-style: none;
    color: #fff;
    &::-webkit-input-placeholder {
      color: var(--cm-placeholder-color);
    }
  }
}
.hot-conainer {
  .title {
    line-height: 30px;
    padding: 10px 15px 0px 15px;
  }
  .hot-item {
    height: 56px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
    .hot-item-left {
      margin-right: 10px;
      width: 20px;
      &.primary {
        color: $color-primary;
      }
    }
    .hot-item-right {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hir-top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name {
      font-weight: bold;
      margin-right: 5px;
    }
    img {
      display: block;
      margin: 0 5px;
    }
    .hir-icon {
      width: 25px;
    }
    .score-icon {
      width: 10px;
    }
    .score,
    .info {
      font-size: 0.7em;
      color: var(--el-text-color-placeholder);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.suggest-container {
  padding-bottom: 20px;
  box-sizing: border-box;
  .suggest-title {
    color: var(--el-text-color-placeholder);
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .suggest-item {
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }
}
@media (max-width: 1200px) {
  .history-icon {
    display: none;
  }
}
</style>
