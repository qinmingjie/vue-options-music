<template>
  <div class="find-comp">
    <!-- 标题切换 -->
    <TitleLink class="find-title" :options="{ ani: true, isCursor: true }">
      <template #default>
        <router-link v-for="link in links" :to="link.path" :key="link.path" custom v-slot="{ navigate, isActive }">
          <span @click="navigate" @keypress.enter="navigate" role="link" :class="{ active: isActive }">
            {{ link.name }}
          </span>
        </router-link>
      </template>
    </TitleLink>
    <!-- 内容区域 -->
    <el-row justify="center" class="find-content">
      <el-col :lg="18" :md="24" :sm="24" :xs="24">
        <router-view #="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import TitleLink from "@/components/title-link/index.vue";

export default {
  name: "FindIndex",
  props: {},
  components: {
    TitleLink
  },
  data() {
    return {
      links: [
        {
          name: "个性推荐",
          path: "/find/recommend"
        },
        {
          name: "排行榜",
          path: "/find/rank-list"
        },
        {
          name: "歌单",
          path: "/find/playlist?tag=华语"
        }
        // {
        //   name: "歌手",
        //   path: "/find/singer-list"
        // },
        // {
        //   name: "新碟上架",
        //   path: "/find/new-disc"
        // }
      ]
    };
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.find-comp {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 4em;
  box-sizing: border-box;
  .find-title {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: var(--cm-content-bg-color);
    padding-bottom: 1.2em;
    margin-bottom: 0;
    padding: 0 var(--cm-scrollbar-padding);
    box-sizing: border-box;
    height: 4em;
    line-height: 4em;
  }
  .find-content {
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    padding: 0 var(--cm-scrollbar-content-space) 0 var(--cm-scrollbar-padding);
  }
}
</style>
