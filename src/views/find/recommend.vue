<template>
  <div class="recommend-container" v-loading="loading">
    <TitleLink :links="links" :options="options" />
    <el-row v-for="(chunk, chunkIndex) in recommendList" :key="chunkIndex">
      <el-col v-for="(recommend, index) in chunk" :key="recommend.id" :span="4" :offset="index > 0 ? 1 : 0">
        <PreviewItem :info="recommend" :path="jumpPath(recommend.id)" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import { mapState } from "vuex";

import { getRecommendPlaylist, getLoginRecommendPlaylist } from "@/api/song";
import { chunkArray } from "@/utils/tool";
import TitleLink from "@/components/title-link/index.vue";
const PreviewItem = defineAsyncComponent(() => import("@/components/preview-item/index.vue"));

export default {
  name: "RecommendComp",
  props: {},
  components: {
    PreviewItem,
    TitleLink
  },
  data() {
    return {
      loading: false,
      recommendList: [],
      options: {
        isBold: true,
        isShowIcon: true,
        hidCursor: true
      },
      links: [{ name: "推荐歌单", path: false }]
    };
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    }),
    jumpPath() {
      return (id) => {
        return `/playlist-detail/${id}`;
      };
    }
  },
  methods: {
    async getRecommendList() {
      this.loading = true;
      try {
        if (this.$isLogin()) {
          // 获取登陆后的热门推荐
          const res = await getLoginRecommendPlaylist({ limit: 20 });
          this.recommendList = chunkArray((res.data?.recommend || []).slice(0, 20), 5);
        } else {
          // 获取普通的热门推荐
          const res = await getRecommendPlaylist({ limit: 20 });
          this.recommendList = chunkArray((res.data?.result || []).slice(0, 20), 5);
        }
      } catch (error) {
        console.error(error);
        this.recommendList = [];
      }
      this.loading = false;
    }
  },
  created() {},
  mounted() {},
  watch: {
    info: {
      handler() {
        this.getRecommendList();
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.recommend-container {
  height: 100%;
}
</style>
