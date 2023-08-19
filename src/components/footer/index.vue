<template>
  <div class="footer-comp" :class="{ mobile: !isShow }">
    <div class="music-card">
      <div class="cover-img">
        <img src="https://p1.music.126.net/h-00JO2cg8eBGVwY4a-s_w==/109951168271842479.jpg" alt="" />
      </div>
      <div class="info">
        <div class="name">让风告诉你让让风告诉你让让风告诉你让让风告诉你让让风告诉你让让风告诉你让</div>
        <div class="artist" v-show="isShow">歌手歌手歌手歌手歌手歌手歌手歌手歌手歌手歌手歌手歌手歌手</div>
      </div>
    </div>
    <div class="music-control">
      <div class="control-action">
        <!-- 播放顺序 -->
        <span v-show="isShow"><i class="iconfont icon-random"></i></span>
        <span v-show="isShow"><i class="iconfont icon-loop"></i></span>

        <span v-show="isShow"><i class="iconfont icon-prev"></i></span>
        <!-- 播放状态 -->
        <span><i class="iconfont icon-play"></i></span>
        <!-- <span><i class="iconfont icon-stop"></i></span> -->

        <span v-show="isShow"><i class="iconfont icon-next"></i></span>
        <span v-show="isShow"><i class="iconfont">词</i></span>
      </div>
      <div class="control-slider" v-show="isShow">
        <span class="current-time">00:00</span>
        <el-slider v-model="value" :show-tooltip="false" size="small" />
        <span class="total-time">33:33</span>
      </div>
    </div>
    <div class="music-play-list">
      <span class="playlist-icon-wrap" @click="isExpand = true"><i class="iconfont icon-playlist"></i></span>
    </div>
    <el-drawer v-model="isExpand" :with-header="false" direction="rtl" size="300px" class="aside-drawer">
      <!-- <SongTable :table-data="createPlaylist" :header-options="headerOptions" :show-index="false" /> -->
    </el-drawer>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapState } from "vuex";
// const SongTable = defineAsyncComponent(() => import("@/components/song-table/index.vue"));
export default {
  name: "FooterComp",
  props: {},
  components: {
    // SongTable
  },
  data() {
    return {
      value: 0,
      isExpand: false,
      headerOptions: [
        {
          label: "音乐标题",
          prop: "name"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      createPlaylist: (state) => state.user?.createPlaylist || []
    }),
    clientWidth() {
      return this.$clientWidth.value;
    },
    isShow() {
      return this.clientWidth > 1200;
    }
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.footer-comp {
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont {
    cursor: pointer;
    font-size: inherit;
  }
  .music-card {
    display: flex;
    width: 15%;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.8em;
    position: absolute;
    left: 0;
    top: 0;
    .cover-img {
      width: 50px;
      height: 50px;
      margin-right: 0.8em;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.5em;
      }
    }
    .info {
      flex: 1;
    }
    .info,
    .name,
    .artist {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      width: 80%;
    }
  }
  .music-control {
    width: 350px;
  }
  .control-action {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.2em;
    span {
      margin: 0 1em;
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
      .icon-play,
      .icon-stop {
        font-size: 1.8em;
      }
    }
    i {
      font-style: normal;
    }
  }
  .control-slider {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .current-time,
    .total-time {
      font-size: 0.7em;
      position: relative;
      top: -1px;
      color: var(--el-text-color-secondary);
    }
  }
  .music-play-list {
    .playlist-icon-wrap {
      height: 100%;
      width: 2em;
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 1em;
    }
  }
  :deep(.el-slider--small) {
    height: 14px;
    margin: 0 0.5em 0 0.6em;
  }
  :deep(.el-slider__button-wrapper) {
    height: 26px;
    width: 26px;
    top: -10px;
  }
  :deep(.el-slider__button) {
    height: 10px;
    width: 10px;
    // width: 0.6em;
    // height: 0.6em;
  }
  &.mobile {
    .music-card {
      width: 50%;
    }
    .music-control {
      width: 100%;
      height: 100%;
      padding-right: 3em;
      .control-action {
        justify-content: flex-end;
        height: 100%;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .icon-stop,
        .icon-play {
          border: 2px solid var(--el-text-color-primary);
          border-radius: 50%;
          padding: 0.4em;
          font-size: 1em;
        }
      }
    }

    .music-play-list {
      .playlist-icon-wrap {
        font-size: 1.3em;
      }
    }
  }
}
</style>
