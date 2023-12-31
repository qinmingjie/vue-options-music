<template>
  <div class="playlist-detail-comp" v-loading="loading">
    <template v-if="playlistData">
      <PlaylistDetailHead :data="playlistData" />
      <TitleLink :options="{ ani: true }">
        <span
          v-for="(link, index) in links"
          :key="link.name"
          :class="{ active: index === active }"
          @click="titleClink(link, index)"
        >
          {{ link.name }}
        </span>
      </TitleLink>
      <SongTable :header-options="songTableHead" :table-data="tracks" :show-index="clientWidth <= 900 ? false : true">
        <template #song-artist="{ row }">
          {{ handlerArtis(row.ar) }}
        </template>
        <template #song-album="{ row }">
          {{ row.al.name }}
        </template>
        <template #song-dt="{ row }">
          {{ handlerdt(row.dt) }}
        </template>
      </SongTable>
    </template>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import { mapState, mapGetters } from "vuex";
const PlaylistDetailHead = defineAsyncComponent(() => import("@/components/playlist-detail-heade/index.vue"));
const TitleLink = defineAsyncComponent(() => import("@/components/title-link/index.vue"));
const SongTable = defineAsyncComponent(() => import("@/components/song-table/index.vue"));
export default {
  name: "PlaylistDetailIndex",
  props: {},
  components: {
    PlaylistDetailHead,
    TitleLink,
    SongTable
  },
  data() {
    return {
      links: [{ name: "歌曲列表" }],
      active: 0,
      tableHead: [
        {
          label: "标题",
          prop: "name"
        },
        {
          slotName: "song-artist",
          label: "歌手",
          width: 300
        },
        {
          slotName: "song-album",
          label: "专辑",
          width: 300
        },
        {
          slotName: "song-dt",
          label: "时间",
          width: 100
        }
        // {
        //   label: "操作",
        //   width: 60
        // }
      ],
      loading: false
    };
  },
  computed: {
    // 获取预览歌单相关store信息
    ...mapGetters({
      tracks: "previewTracks",
      total: "previewTotal",
      previewId: "previewId"
    }),
    ...mapState({
      playlistData: (state) => state.song.previewPlaylistDetail
    }),
    playlistId() {
      return this.$route.params?.id;
    },
    clientWidth() {
      return this.$clientWidth.value;
    },
    songTableHead() {
      if (this.clientWidth <= 900) {
        return this.tableHead.filter((item) => item.label === "时间" || item.label === "标题");
      } else if (this.clientWidth <= 1200) {
        return this.tableHead.filter((item) => item.label !== "专辑");
      } else {
        return this.tableHead;
      }
    }
  },
  methods: {
    // 标题点击
    titleClink(link, index) {
      this.active = index;
      link?.path && this.$router.push(link.path);
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

    // 获取歌单详情
    async getPlaylistDetail() {
      this.loading = true;
      await this.$store.dispatch("playlistDetail", this.playlistId);
      this.loading = false;
    }
  },
  created() {
    this.getPlaylistDetail();
  },
  mounted() {},
  watch: {
    playlistId: {
      handler(newVal) {
        newVal && this.getPlaylistDetail();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.playlist-detail-comp {
  height: 100%;
  padding-right: var(--cm-scrollbar-content-space);
  overflow: hidden;
  overflow-y: scroll;
  .playlist-detail-head-comp {
    margin-bottom: 2em;
    padding: 2em 0 0 var(--cm-scrollbar-padding);
    box-sizing: border-box;
  }
  .title-link-container,
  .song-table-comp {
    padding-left: var(--cm-scrollbar-padding);
  }
  :deep(.el-table .default-cell),
  :deep(.el-table .default-cell div) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
