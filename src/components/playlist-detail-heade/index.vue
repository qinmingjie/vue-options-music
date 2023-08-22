<template>
  <div class="playlist-detail-head-comp">
    <div class="playlist-head-left" v-show="!hiddenCard">
      <PreviewListCard :lists="cardData" :show="[]" :is-jump="false" />
    </div>
    <div :class="['playlist-head-right', 'playlist-info', hiddenCard ? 'reset-width' : '']">
      <p class="title">
        <span class="tip">歌单</span><span class="name">{{ data.name }}</span>
      </p>
      <div class="creator">
        <img :src="data.creator.avatarUrl" alt="" loading="lazy" />
        <span class="nickname" :title="data.creator.nickname">{{ data.creator.nickname }}</span>
        <span class="create-time">{{ createTime }}</span>
      </div>
      <div class="count">
        <el-button class="play" type="primary" round @click="play(data.id)">
          <i class="iconfont icon-play"></i>播放
        </el-button>
        <el-button class="subscribe" type="default" round>
          <i class="iconfont icon-subscribe"></i>收藏{{ count(data.subscribedCount, true) }}
        </el-button>
        <el-button class="share" type="default" round>
          <i class="iconfont icon-share"></i>分享{{ count(data.shareCount, true) }}
        </el-button>
      </div>
      <div class="other">
        <div class="tags">
          标签:
          <router-link v-for="link in data.tags" :to="'/find/playlist?tag=' + link" :key="link">{{ link }}</router-link>
        </div>
        <div class="songs">
          歌曲:<span>{{ data.trackCount }}</span> 播放:<span>{{ count(data.playCount) }}</span>
        </div>
        <div class="intro">
          简介:<span :title="data.description">{{ data.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatTimeStamp, formatPlayCount } from "@/utils/tool";
import { mapGetters } from "vuex";
const PreviewListCard = defineAsyncComponent(() => import("@/components/preview-list-card/index.vue"));
export default {
  name: "PlaylistDetailHead",
  props: {
    data: {
      type: Object,
      require: true,
      default: () => {
        return null;
      }
    }
  },
  components: {
    PreviewListCard
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      previewId: "previewId",
      previewTracks: "previewTracks"
    }),
    cardData() {
      return this.data && [{ id: this.data.id, picUrl: this.data.coverImgUrl }];
    },
    creatorData() {
      return this.data?.creator;
    },
    createTime() {
      return this.data && formatTimeStamp(this.data.createTime);
    },
    clientWidth() {
      return this.$clientWidth.value;
    },
    hiddenCard() {
      return this.clientWidth < 1000;
    }
  },
  methods: {
    count(val, isSymb) {
      if (isSymb) {
        return val ? `(${formatPlayCount(val)})` : "";
      }
      return val ? `${formatPlayCount(val)}` : "";
    },
    async play(playlistId) {
      if (this.previewId !== playlistId) {
        await this.$store.dispatch("playlistDetail", playlistId);
      }
      await this.$store.dispatch("play", { lists: this.previewTracks });
    }
  }
};
</script>

<style lang="scss" scoped>
.playlist-detail-head-comp {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .playlist-head-left {
    width: 14%;
    .preview-list-card-comp {
      margin-right: 1.5em;
    }
  }
  .playlist-info {
    flex: 1;
    max-width: 80%;
    &.reset-width {
      max-width: 100%;
    }
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 0 0.5em 0;
      .tip {
        color: $color-primary;
        padding: 0 0.3em;
        border: 1px solid $color-primary;
        border-radius: 0.2em;
        font-size: 0.8em;
        margin-right: 1em;
      }
      .name {
        display: inline-block;
        font-size: 1.4em;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .creator {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 0.5em;
      img {
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        margin-right: 0.4em;
      }
      .nickname {
        font-size: 0.8em;
        margin-right: 0.4em;
        max-width: 20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        color: var(--cm-custom-link-color);
        &:hover {
          color: var(--cm-custom-link-color-hover);
        }
      }
      .create-time {
        font-size: 0.8em;
        color: var(--el-text-color-secondary);
      }
    }
    .count {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-block: 1em;
      span {
        padding: 0.4em 0.8em;
        border: 1px solid var(--el-border-color);
        cursor: pointer;
        margin-right: 0.8em;
        border-radius: 10em;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.9em;
        &:last-of-type {
          margin-right: 0;
        }
        .iconfont {
          font-size: 1.3em;
          margin-right: 0.2em;
        }
      }
    }
    .other {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .tags,
      .songs,
      .intro {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.9em;
        margin-bottom: 0.4em;
        color: var(--el-text-color-primary);
        span {
          margin: 0 0.5em;
          color: var(--el-text-color-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        a {
          color: var(--cm-custom-link-color);
          margin-right: 0.5em;
          text-decoration: none;
          &:hover {
            color: var(--cm-custom-link-color-hover);
          }
          &:first-of-type {
            margin-left: 0.5em;
          }
        }
      }
    }
  }
}
</style>
