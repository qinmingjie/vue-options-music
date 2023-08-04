<template>
  <div class="playlist-comp">
    <!-- 头部精品歌单 -->
    <div class="highquality-playlist-container" v-if="hightqulityData">
      <div class="blur">
        <img :src="hightqulityData.coverImgUrl" alt="" />
      </div>
      <el-image :src="hightqulityData.coverImgUrl" />
      <div class="info">
        <span class="info-flex">
          <el-icon><IEpMedal /></el-icon>
          <span>精品歌单</span>
        </span>
        <div>{{ hightqulityData.name }}</div>
      </div>
    </div>
    <!-- 分类 -->
    <div class="category-flex">
      <!-- 全部分类 -->
      <span class="category">
        <span ref="categoryPop" v-click-outside="onClickOutside" @click="getPlaylistCatlist">
          {{ tag }}
          <el-icon><IEpArrowRight /></el-icon>
        </span>
        <el-popover
          ref="popRef"
          :virtual-ref="categoryPop"
          trigger="click"
          virtual-triggering
          width="28em"
          :show-arrow="false"
          :popper-style="{
            padding: 0
          }"
        >
          <div class="category-scroll-wrap" v-loading="catrgoryLoading">
            <el-scrollbar height="40vh">
              <template v-if="categorys.length">
                <el-row v-for="(cateRow, index) in categorys" :key="index" class="category-row">
                  <el-col :span="6" v-for="categoryItem in cateRow" :key="categoryItem.name">
                    <span
                      :class="{ active: categoryItem.name === tag }"
                      @click="$router.push(`/find/playlist?tag=${categoryItem.name}`)"
                    >
                      {{ categoryItem.name }}
                    </span>
                  </el-col>
                </el-row>
              </template>
            </el-scrollbar>
          </div>
        </el-popover>
      </span>
      <!-- 热门分类 -->
      <span class="hot-category" v-if="hotCategory.length">
        <span
          v-for="hotItem in hotCategory"
          :key="hotItem.id"
          :class="{ 'hot-category-item': true, active: hotItem.name === tag }"
          @click="$router.push(`/find/playlist?tag=${hotItem.name}`)"
        >
          {{ hotItem.name }}
        </span>
      </span>
    </div>
    <el-row v-for="(chunk, chunkIndex) in chunkPlaylist" :key="chunkIndex">
      <el-col
        v-for="(playlistItem, index) in chunk"
        :key="playlistItem.id"
        :span="span"
        :offset="index > 0 ? offset : 0"
      >
        <PreviewItem :info="playlistItem" :path="jumpPath(playlistItem.id)" />
      </el-col>
    </el-row>
    <!-- 歌单分页 -->
    <el-pagination
      v-model="currentPage"
      :page-size="limit"
      :small="true"
      :disabled="false"
      :background="true"
      layout="prev, pager, next"
      :total="total"
      @size-change="getPlaylistUnderCategory"
      @current-change="getPlaylistUnderCategory"
    />
  </div>
</template>
<script>
import { playlistCatlist, hotPlaylistCategory, highquality, playlistUnderCategory } from "@/api/song";
import { chunkArray } from "@/utils/tool";
import { ClickOutside } from "element-plus";
export default {
  name: "PlaylistComp",
  props: {},
  components: {},
  data() {
    return {
      hightqulity: [], // 精品歌单
      hotCategory: [], // 热门分类
      categorys: [], // 全部分类
      originPlaylists: [], // 原始歌单列表
      limit: 10,
      currentPage: 1,
      total: 1000,
      offset: 1,
      span: 4,
      categoryPop: null,
      catrgoryLoading: true
    };
  },
  computed: {
    tag() {
      return this.$route.query?.tag || "华语";
    },
    hightqulityData() {
      return this.hightqulity
        .filter((item) => item.tags.includes(this.tag === "全部" ? "华语" : this.tag))
        .slice(0, 1)[0];
    },
    clientWidth() {
      return this.$clientWidth.value;
    },
    chunkPlaylist() {
      return this.clientWidth <= 500 ? chunkArray(this.originPlaylists, 2) : chunkArray(this.originPlaylists, 5);
    },

    jumpPath() {
      return (id) => {
        return `/playlist-detail/${id}`;
      };
    }
  },
  created() {
    this.getHotPlaylistCatlist();
    this.getHighqulity();
    this.$nextTick(() => {
      this.categoryPop = this.$refs.categoryPop;
    });
  },
  methods: {
    // 获取全部分类
    async getPlaylistCatlist() {
      if (this.categorys.length) {
        return;
      }
      try {
        this.catrgoryLoading = true;
        const catRes = await playlistCatlist();
        let { sub = [] } = catRes?.data || {};
        this.categorys = chunkArray(await this.handerResult(sub, ["name"]), 4);
      } catch (error) {
        console.log(error);
      }
      this.catrgoryLoading = false;
    },

    // 获取热门分类
    async getHotPlaylistCatlist() {
      const hotRes = await hotPlaylistCategory();
      let { tags = [] } = hotRes?.data || {};
      this.hotCategory = await this.handerResult(tags, ["name", "id"]);
    },

    // 获取精品歌单
    async getHighqulity() {
      const res = await highquality();
      let { playlists = [] } = res?.data || {};
      this.hightqulity = await this.handerResult(playlists, ["id", "name", "tags", "coverImgUrl"]);
    },

    // 获取分类下的歌单
    async getPlaylistUnderCategory(val) {
      if (val) this.currentPage = val;
      const res = await playlistUnderCategory({
        cat: this.tag,
        limit: this.limit,
        offset: this.currentPage - 1,
        pageSize: 100
      });
      const { playlists = [], total = 0 } = res?.data || {};
      this.total = total;
      this.originPlaylists.length = 0;
      playlists.forEach((item) => {
        this.originPlaylists.push({
          id: item.id,
          picUrl: item.coverImgUrl,
          name: item.name,
          playCount: item.playCount
        });
      });
    },

    // 格式化分类返回数据
    async handerResult(res = [], keys) {
      return await res.map((item) => {
        const obj = {};
        keys.forEach((element) => {
          obj[element] = item[element];
        });
        return obj;
      });
    },

    // 隐藏弹窗
    onClickOutside() {
      this.$refs.popRef?.delayHide?.();
    }
  },
  mounted() {},
  watch: {
    tag: {
      handler() {
        this.currentPage = 1;
        this.getPlaylistUnderCategory();
      },
      immediate: true
    },
    clientWidth: {
      handler(val) {
        if (val <= 500) {
          (this.span = 11), (this.offset = 2);
          return;
        }
        this.span = 4;
        this.offset = 1;
      },
      immediate: true
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
<style lang="scss" scoped>
.playlist-comp {
  .highquality-playlist-container {
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 15px;
    z-index: 1;
    margin-bottom: 1.5em;
    .blur {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      overflow: hidden;
      filter: blur(30px) brightness(0.9);
      z-index: -1;
      img {
        width: 100%;
      }
    }
    .info-flex {
      display: inline-block;
      color: #e7aa5a;
      border: 1px solid #e7aa5a;
      padding: 0.1em 0.4em;
      border-radius: 10em;
      margin-bottom: 1em;
      margin-top: 0.5em;
      i {
        position: relative;
        top: 0.2em;
      }
    }
    ::v-deep(.el-image) {
      display: block;
      border-radius: 5px;
      margin-right: 1em;
      width: 140px;
    }
  }
  .category-flex {
    font-size: 0.8em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5em;
  }
  .category {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid var(--el-border-color);
    padding: 0.3em 1.5em;
    border-radius: 50px;
    cursor: pointer;
    .el-icon {
      position: relative;
      top: 2px;
    }
  }
  .hot-category {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      display: inline-block;
      margin-right: 0.1em;
      cursor: pointer;
      opacity: 0.8;
      transition: all 0.5s;
      padding: 0.1em 0.5em;
      border-radius: 10em;
      &.active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  :v-deep(.category-scroll-wrap) {
    width: 300px;
    height: 400px;
  }
}

.category-row {
  margin-bottom: 0.6em;
  span {
    display: inline-block;
    font-size: 0.9em;
    margin-left: 0.6em;
    padding: 0.2em 0.5em;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.5s;
    &:hover {
      opacity: 1;
    }
    &.active {
      background-color: var(--el-color-primary-light-9);
      border-radius: 50em;
      color: var(--el-color-primary);
      opacity: 1;
    }
  }
}
.category-scroll-wrap {
  padding: 15px 0 0 15px;
}
</style>
