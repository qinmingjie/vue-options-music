<template>
  <div class="everyday-comp" v-loading="loading">
    <div class="everyday-top">
      <div class="everyday-description">
        <span class="date">
          <span>{{ day }}</span>
        </span>
        <div class="info">
          <p class="title">每日歌曲推荐</p>
          <p class="description">根据你的口味生成,每天6:00更新</p>
        </div>
      </div>
      <div class="everyday-actions">
        <el-button type="primary" round class="play" @click="play">
          <i class="iconfont icon-play"></i>播放全部
        </el-button>
        <el-button type="default" round class="subscribe"><i class="iconfont icon-subscribe"></i>收藏全部</el-button>
      </div>
    </div>
    <SongTable :table-data="songs" :header-options="songTableHeader" :show-index="showIndex">
      <template #song-al="{ row }">
        {{ handlerArtis(row.ar) }}
      </template>
      <template #song-album="{ row }">{{ row.al.name }}</template>
      <template #song-time="{ row }">{{ handlerdt(row.dt) }}</template>
    </SongTable>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import { recommendSongs } from "@/api/song";
import { getAppointAttr } from "@/utils/tool";
const SongTable = defineAsyncComponent(() => import("@/components/song-table/index.vue"));
export default {
  name: "EverydayIndex",
  props: {},
  components: { SongTable },
  data() {
    return {
      songs: [],
      showIndex: true,
      tableHeader: [
        {
          label: "音乐标题",
          prop: "name"
        },
        {
          slotName: "song-al",
          label: "歌手",
          width: 300
        },
        {
          slotName: "song-album",
          label: "专辑",
          width: 300
        },
        {
          slotName: "song-time",
          label: "时间",
          width: 80
        }
      ],
      loading: false
    };
  },
  computed: {
    day() {
      return new Date().getDate();
    },
    clientWidth() {
      return this.$clientWidth.value;
    },
    songTableHeader() {
      if (this.clientWidth <= 900) {
        return this.tableHeader.filter((item) => item.label === "音乐标题" || item.label === "时间");
      } else if (this.clientWidth <= 1200) {
        return this.tableHeader.filter((item) => item.label !== "专辑");
      } else {
        return this.tableHeader;
      }
    }
  },
  methods: {
    async getRecommendSongs() {
      this.loading = true;
      try {
        const attr = ["id", "name", "ar", "dt", "al"];
        const res = await recommendSongs();
        const { dailySongs = [] } = res?.data?.data || {};
        this.songs = dailySongs.map((item) => getAppointAttr(item, attr));
      } catch (error) {
        console.error("获取推荐音乐出错", error);
      }
      this.loading = false;
    },
    handlerArtis(artists) {
      return artists && artists.map((item) => item.name).join("/");
    },
    handlerdt(time) {
      let hours = parseInt(time / (1000 * 60 * 60));
      let minute = parseInt((time - hours * (1000 * 60 * 60)) / (1000 * 60));
      let second = parseInt((time - hours * (1000 * 60 * 60) - minute * (1000 * 60)) / 1000);
      hours = hours >= 10 ? hours : "0" + hours;
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;
      return `${parseInt(hours) > 0 ? hours : ""}${minute}:${second}`;
    },
    play() {
      this.$store.dispatch("play", { lists: this.songs });
    }
  },
  created() {
    this.getRecommendSongs();
  },
  mounted() {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.everyday-comp {
  height: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  .everyday-top {
    padding: 1.5em var(--cm-scrollbar-content-space) 0.6em 2em;
    border-bottom: 1px solid var(--el-border-color);
  }
  .everyday-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2em;
    .date {
      display: flex;
      width: 76px;
      height: 68px;
      border: 4px solid $color-primary;
      border-radius: 1em;
      position: relative;
      justify-content: center;
      align-items: center;
      &::before,
      &::after {
        content: "";
        display: block;
        width: 4px;
        height: 14px;
        background-color: $color-primary;
        border-radius: 50px;
        position: absolute;
        top: -9px;
      }
      &::before {
        left: 20%;
      }
      &::after {
        right: 20%;
      }
      span {
        font-size: 2em;
        color: $color-primary;
        font-weight: bold;
        position: relative;
        top: 2px;
        &::before {
          content: "";
          display: block;
          width: 100%;
          height: 4px;
          background-color: $color-primary;
          border-radius: 50px;
        }
      }
    }
    .info {
      flex: 0.985;
      p {
        margin: 0;
        color: inherit;
      }
      .title {
        font-size: 1.3em;
        font-weight: bold;
        margin-bottom: 0.5em;
      }
      .description {
        font-size: 0.8em;
        opacity: 0.8;
      }
    }
  }
  .everyday-actions {
    position: relative;
  }
  .song-table-comp {
    padding: 0 var(--cm-scrollbar-content-space) 0 var(--cm-scrollbar-padding);
  }
}
</style>
