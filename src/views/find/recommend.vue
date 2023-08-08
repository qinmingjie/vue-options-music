<template>
  <div class="recommend-container" v-loading="loading">
    <TitleLink :links="links" :options="options" />
    <el-row v-for="(chunk, chunkIndex) in handlerList" :key="chunkIndex">
      <el-col v-for="(recommend, index) in chunk" :key="recommend.id" :span="span" :offset="index > 0 ? offset : 0">
        <PreviewCard :info="recommend" :path="jumpPath(recommend.id)" />
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
const PreviewCard = defineAsyncComponent(() => import("@/components/preview-card/index.vue"));

export default {
  name: "RecommendComp",
  props: {},
  components: {
    PreviewCard,
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
      span: 4,
      offset: 1,
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
    },
    clientWidth() {
      return this.$clientWidth.value;
    },

    handlerList() {
      return this.clientWidth <= 500 ? chunkArray(this.recommendList, 2) : chunkArray(this.recommendList, 5);
    }
  },
  methods: {
    async getRecommendList() {
      this.loading = true;
      try {
        if (this.$isLogin()) {
          // 获取登陆后的热门推荐
          const res = await getLoginRecommendPlaylist({ limit: 20 });
          this.recommendList = res.data?.recommend || []; // chunkArray((res.data?.recommend || []).slice(0, 20), 5);
        } else {
          // 获取普通的热门推荐
          const res = await getRecommendPlaylist({ limit: 20 });
          this.recommendList = res.data?.result || []; //chunkArray((res.data?.result || []).slice(0, 20), 5);
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
  }
};
</script>
<style lang="scss" scoped>
.recommend-container {
  height: 100%;
}
</style>
