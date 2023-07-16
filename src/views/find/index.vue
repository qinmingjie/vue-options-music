<template>
  <div>
    <router-link v-for="link in links" :key="link.path" :to="link.path">{{ link.name }} </router-link>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "FindIndex",
  props: {},
  components: {},
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
          path: "/find/playlist/华语"
        },
        {
          name: "歌手",
          path: "/find/singer-list"
        },

        {
          name: "每一天",
          path: "/everyday"
        }
      ]
    };
  },
  computed: {},
  methods: {},
  created() {
    console.log(this.$router.getRoutes());
  },
  mounted() {},
  watch: {}
};
</script>
<style lang="scss" scoped></style>
