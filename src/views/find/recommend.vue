<template>
  <div class="recommend-container" v-loading="loading">
    <TitleLink :links="links" :options="titleOptions" />
    <PreviewListCard
      :lists="recommendList"
      :base-skip-path="'/playlist-detail/'"
      @cardClick="jump"
      :is-response="true"
    />
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import { mapState } from "vuex";

import { getRecommendPlaylist, getLoginRecommendPlaylist } from "@/api/song";
import TitleLink from "@/components/title-link/index.vue";
const PreviewListCard = defineAsyncComponent(() => import("@/components/preview-list-card/index.vue"));

export default {
  name: "RecommendComp",
  props: {},
  components: {
    PreviewListCard,
    TitleLink
  },
  data() {
    return {
      loading: false,
      recommendList: [],
      titleOptions: {
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
    clientWidth() {
      return this.$clientWidth.value;
    }
  },
  methods: {
    async getRecommendList() {
      this.loading = true;
      try {
        if (this.$isLogin()) {
          // 获取登陆后的热门推荐
          const res = await getLoginRecommendPlaylist({ limit: 10 });
          this.recommendList = res.data?.recommend || []; // chunkArray((res.data?.recommend || []).slice(0, 20), 5);
        } else {
          // 获取普通的热门推荐
          const res = await getRecommendPlaylist({ limit: 10 });
          this.recommendList = res.data?.result || []; //chunkArray((res.data?.result || []).slice(0, 20), 5);
        }
      } catch (error) {
        console.error(error);
        this.recommendList = [];
      }
      this.loading = false;
    },
    jump(params) {
      params && this.$router.push("/playlist-detail/" + params.id);
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
