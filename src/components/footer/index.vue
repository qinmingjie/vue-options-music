<template>
  <div class="footer-comp" :class="{ mobile: !isShow }">
    <div class="music-card">
      <div class="cover-img">
        <img :src="musicData.picUrl" alt="" v-if="musicUrl" />
        <img src="../../assets/img-place.png" alt="" v-else />
      </div>
      <div class="info" v-if="musicUrl">
        <div class="name">{{ musicData.name }}</div>
        <div class="artist" v-show="isShow">{{ musicData.ar }}</div>
      </div>
    </div>
    <div class="music-control">
      <div class="control-action">
        <!-- 播放顺序 -->
        <span>
          <i class="iconfont icon-random" v-show="isShow && random" @click="random = false"></i>
          <i class="iconfont icon-loop" v-show="isShow && !random" @click="random = true"></i>
        </span>

        <span v-show="isShow" @click="prevOrNext('prev')"><i class="iconfont icon-prev"></i></span>
        <!-- 播放状态 -->
        <span v-show="!isPlay" @click="toggleAudioStatus(true)"><i class="iconfont icon-play"></i></span>
        <span v-show="isPlay" @click="toggleAudioStatus(false)"><i class="iconfont icon-stop"></i></span>

        <span v-show="isShow" @click="prevOrNext()"><i class="iconfont icon-next"></i></span>
        <span v-show="isShow"><i class="iconfont">词</i></span>
      </div>
      <div class="control-slider" v-if="isShow">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <el-slider v-model="slider" @input="sliderToCurrentTime" :show-tooltip="false" size="small" />
        <span class="total-time">{{ formatTime(musicData.dt) }}</span>
      </div>
    </div>
    <div class="music-play-list">
      <span class="playlist-icon-wrap" @click="isExpand = true"><i class="iconfont icon-playlist"></i></span>
    </div>
    <el-drawer
      v-model="isExpand"
      :with-header="false"
      :direction="drawerOptions.direction"
      :show-close="true"
      :size="drawerOptions.width"
      class="aside-drawer"
    >
      <SongTable
        :table-data="playlist"
        :header-options="headerOptions"
        :show-index="false"
        :show-header="false"
        v-if="playlist.length"
      >
        <template #song-name="{ row }">
          <span :class="{ active: row.id === musicId, name: true }">{{ row.name }}</span>
        </template>
        <template #song-ar="{ row }">
          <span :class="{ active: row.id === musicId, ar: true }">{{ row.ar[0].name }}</span>
        </template>
        <template #song-time="{ row }">
          <span class="time">{{ formatTime(row.dt) }}</span>
        </template>
      </SongTable>
      <div v-else class="no-playlist">暂无数据</div>
    </el-drawer>
    <audio
      :src="musicUrl"
      ref="audio"
      autoplay
      @timeupdate="getCurrentTime"
      :currentTime="sliderTime / 1000"
      @ended="prevOrNext()"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { musicUrl } from "@/api/song";
import SongTable from "@/components/song-table/index.vue";
export default {
  name: "FooterComp",
  props: {},
  components: {
    SongTable
  },
  data() {
    return {
      isExpand: false,
      headerOptions: [
        {
          slotName: "song-name"
        },
        {
          slotName: "song-ar",
          width: 90
        },
        {
          slotName: "song-time",
          width: 70
        }
      ],
      musicUrl: "",
      currentTime: 0, // 当前音乐播放进度,单位毫秒
      slider: 0, // 0-100
      sliderTime: 0,
      isPlay: false,
      random: false // 随机播放
    };
  },
  computed: {
    ...mapState({
      createPlaylist: (state) => state.user.createPlaylist || [],
      musicId: (state) => state.song.currentId,
      playlist: (state) => state.song.playlist
    }),
    ...mapGetters(["currentMusic"]),
    clientWidth() {
      return this.$clientWidth.value;
    },
    isShow() {
      return this.clientWidth > 1200;
    },
    musicData() {
      const music = this.currentMusic.map((item) => {
        const ar = item.ar.map((item) => item.name).join("/");
        return { name: item.name, picUrl: item.al.picUrl, ar, dt: item.dt };
      });
      return music[0] || {};
    },
    drawerOptions() {
      return {
        direction: this.clientWidth <= 1200 ? "btt" : "rtl",
        width: this.clientWidth <= 1200 ? "auto" : 400
      };
    }
  },
  methods: {
    async getMusicUrl(id) {
      const res = await musicUrl({ id: id, level: "standard" });
      const { data = [] } = res?.data || {};
      const { url = "" } = data[0] || {};
      if (!url) {
        this.$message.warning("哦豁,暂无版权!");
        return;
      }
      this.musicUrl = url;
      this.toggleAudioStatus(true);
    },
    formatTime(ms = 0) {
      const time = ms / 1000;
      let hour = parseInt(time / 60 / 60).toString();
      let minute = parseInt((time / 60) % 60).toString();
      let second = parseInt(time % 60).toString();
      hour = hour.padStart(2, "0");
      minute = minute.padStart(2, "0");
      second = second.padStart(2, "0");
      return `${parseInt(hour) > 0 ? hour + ":" : ""}${minute}:${second}`;
    },
    // 获取当前的音乐播放进度
    getCurrentTime(e) {
      // currentTime单位为秒
      const { currentTime = 0 } = e?.target || {};
      this.currentTime = currentTime * 1000;
      this.slider = ((currentTime * 1000) / (this.musicData.dt || 0)) * 100;
    },
    // 将slider的位置转换为当前播放位置
    sliderToCurrentTime(val) {
      const currentTime = (this.musicData.dt || 0 / 100) * val;
      this.sliderTime = this.currentTime = currentTime / 100;
    },
    // 播放和暂停
    toggleAudioStatus(isPlay) {
      if (!this.musicUrl) {
        return;
      }
      this.isPlay = isPlay;
      isPlay && this.$refs.audio.play();
      !isPlay && this.$refs.audio.pause();
    },
    // 上一曲和下一曲
    prevOrNext(type = "next") {
      if (!this.playlist.length) {
        this.$message.warning("请选择一首音乐播放吧!");
        return;
      }
      let currentIndex = this.playlist.findIndex((item) => item.id === this.musicId);
      if (currentIndex === -1) {
        currentIndex = 0;
      }
      if (type === "next") {
        currentIndex++;
        currentIndex >= this.playlist.length && (currentIndex = 0);
      }
      if (type === "prev") {
        currentIndex--;
        currentIndex < 0 && (currentIndex = this.playlist.length - 1);
      }
      if (this.random === true) {
        currentIndex = Math.floor(Math.random() * this.playlist.length);
      }
      this.$store.commit("setCurrentId", this.playlist[currentIndex].id);
    }
  },
  created() {},
  mounted() {},
  watch: {
    musicId: {
      async handler(newVal) {
        newVal && this.getMusicUrl(newVal);
      }
    }
  }
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
      border: 1px solid var(--el-border-color);
      border-radius: 0.5em;
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
  .name,
  .ar,
  .time {
    font-weight: bold;
    &.active {
      color: $color-primary;
    }
  }
  .time {
    color: var(--el-text-color-secondary);
  }
  .no-playlist {
    display: flex;
    height: 100%;
    min-height: 30vh;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: var(--el-text-color-secondary);
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
  :deep(.el-drawer__body) {
    padding-left: 0;
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
    :deep(.song-table-comp) {
      max-height: 50vh;
    }
    :deep(.el-drawer) {
      border-radius: 1em 1em 0 0;
    }
  }
}
</style>
