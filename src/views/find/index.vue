<template>
  <div>
    <TitleLink :ani="true">
      <template #default>
        <span
          v-for="link in links"
          :key="link.path"
          @click="currentLink = link.component"
          :class="{ active: currentLink === link.component }"
          >{{ link.name }}</span
        >
      </template>
    </TitleLink>
    <keep-alive>
      <component :is="currentComp"></component>
    </keep-alive>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import TitleLink from "@/components/title-link/index.vue";

export default {
  name: "FindIndex",
  props: {},
  components: {
    TitleLink
  },
  data() {
    return {
      currentLink: "Recommend",
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
      const comps = {
        Recommend: defineAsyncComponent(() => import("./recommend.vue")),
        PlayList: defineAsyncComponent(() => import("./playlist.vue")),
        RankList: defineAsyncComponent(() => import("./rank-list.vue")),
        NewDisc: defineAsyncComponent(() => import("./new-disc.vue")),
        SingerList: defineAsyncComponent(() => import("./singer-list.vue"))
      };
      return comps[this.currentLink];
    }
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {}
};
</script>
<style lang="scss" scoped></style>
