<template>
  <div class="playlist-comp" v-loading="!originPlaylists.length && contentLoading">
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
          :show-arrow="false"
          :width="clientWidth < 1200 ? 300 : 400"
          :popper-style="{
            padding: 0
          }"
        >
          <div class="category-scroll-wrap" v-loading="catrgoryLoading">
            <el-scrollbar height="40vh">
              <template v-if="categorys.length">
                <el-row v-for="(cateRow, index) in handleCategorys" :key="index" class="category-row">
                  <el-col :span="clientWidth < 1200 ? 8 : 6" v-for="categoryItem in cateRow" :key="categoryItem.name">
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
      <span class="hot-category" v-if="hotCategory.length && isHidenHotCategorys">
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
    <div v-if="originPlaylists.length" v-loading="originPlaylists.length && contentLoading">
      <PreviewListCard :lists="originPlaylists" @cardClick="jump" :is-response="true" />
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
  </div>
</template>
<script>
import { playlistCatlist, hotPlaylistCategory, highquality, playlistUnderCategory } from "@/api/song";
import { chunkArray } from "@/utils/tool";
import { ClickOutside } from "element-plus";
import { defineAsyncComponent } from "vue";
const PreviewListCard = defineAsyncComponent(() => import("@/components/preview-list-card/index.vue"));
export default {
  name: "PlaylistComp",
  props: {},
  components: { PreviewListCard },
  data() {
    return {
      hightqulity: [], // 精品歌单
      hotCategory: [], // 热门分类
      categorys: [], // 全部分类
      originPlaylists: [], // 原始歌单列表
      limit: 20,
      currentPage: 1,
      total: 0,
      categoryPop: null,
      catrgoryLoading: true,
      contentLoading: true
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
    isHidenHotCategorys() {
      return this.$clientWidth.value >= 1200 ? true : false;
    },
    handleCategorys() {
      return this.$clientWidth.value < 1200 ? chunkArray(this.categorys, 3) : chunkArray(this.categorys, 4);
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
        this.categorys = await this.handerResult(sub, ["name"]); // chunkArray(await this.handerResult(sub, ["name"]), 4);
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
      this.contentLoading = true;
      if (val) this.currentPage = val;
      try {
        const res = await playlistUnderCategory({
          cat: this.tag,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
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
      } catch (error) {
        console.error(error);
      }
      this.contentLoading = false;
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
    },

    jump(params) {
      params && this.$router.push(`/playlist-detail/${params.id}`);
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
  height: 100%;
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
  .el-pagination {
    margin: 30px 0;
    justify-content: center;
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
