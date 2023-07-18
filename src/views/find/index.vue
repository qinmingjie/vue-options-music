<template>
  <div>
    <span v-for="tab in links" :key="tab.path" @click="currentTab = tab.component">{{ tab.name }}</span>
    <keep-alive>
      <component :is="currentComp"></component>
    </keep-alive>
  </div>
</template>
<script>
import Recommend from "./recommend.vue";
import PlayList from "./playlist.vue";
import RankList from "./rank-list.vue";
import NewDisc from "./new-disc.vue";
import SingerList from "./singer-list.vue";

export default {
  name: "FindIndex",
  props: {},
  components: {},
  data() {
    return {
      currentTab: "Recommend",
      links: [
        {
          name: "个性推荐",
          path: "/find/recommend",
          component: "Recommend"
        },
        {
          name: "排行榜",
          path: "/find/rank-list",
          component: "RankList"
        },
        {
          name: "歌单",
          path: "/find/playlist/华语",
          component: "PlayList"
        },
        {
          name: "歌手",
          path: "/find/singer-list",
          component: "SingerList"
        },
        {
          name: "新碟上架",
          path: "/find/new-disc",
          component: "NewDisc"
        }
      ]
    };
  },
  computed: {
    currentComp() {
      const tabs = {
        Recommend,
        PlayList,
        RankList,
        NewDisc,
        SingerList
      };
      return tabs[this.currentTab];
    }
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {}
};
</script>
<style lang="scss" scoped></style>
